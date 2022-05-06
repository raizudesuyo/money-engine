import { getConnection } from 'typeorm'
import { ethers, BigNumber } from 'ethers';

import { 
    IData, 
    IMaiVaultContractData, 
    IQiDaoVaultService, 
    IQiDaoVaultData, 
    QiDaoVaultService, 
    QiDaoVaultContractAdapterFactory, 
    QiDaoSmartContractListenerFactory, 
    IQiDaoSmartContractListener,
    LoggerSingleton,
    Web3WebSocketFactory, 
    Web3Chain } from '@money-engine/common';
import { QiVault, QiVaultData } from 'qi-db';

import { updateVaultUserData } from './utils/QiDaoPrismaUtils';

// Sets up listener for each, assume everything is a erc20QiStablecoin event, coz they mostly are
// Only update support for cross-chain vaults

interface ListenerParams {
    vaultListener: IQiDaoSmartContractListener,
    vault: IMaiVaultContractData,
    vaultService: IQiDaoVaultService
}

export const listen = async () => {
    const log = LoggerSingleton.getInstance();

    log.info('Starting to Listen');
    const data = require('../config.json') as IData;

    
    data.maiVaultContracts.forEach((vault) => {
        log.info(`Listening to Events ${vault.name}`)
        // const contract = Erc20QiStablecoin__factory.connect(vault.address, provider);

        const provider = Web3WebSocketFactory.getProvider(vault.chain as Web3Chain);

        if(!provider) {
            log.info(`Unssuported vault ${vault.chain}-${vault.name}`)
            return;
        }

        const vaultAdapter = QiDaoVaultContractAdapterFactory.getProvider({
            contractAddress: vault.address,
            contractProvider: provider,
            contractType: vault.type
        });
        const vaultListener = QiDaoSmartContractListenerFactory.getProvider({
            contractAddress: vault.address,
            contractProvider: provider,
            contractType: vault.type
        })
        const vaultService = new QiDaoVaultService(vaultAdapter);

        const params: ListenerParams = {
            vaultListener,
            vaultService,
            vault
        }

        listenToCreateVault(params);
        listenToCollateralDeposits(params);
        listenToCollateralWithdrawals(params);
        listenToTokenBorrows(params);
        listenToTokenRepayments(params);
        listenToVaultLiquidations(params);
    })

    // log.info(provider.listenerCount())
}

// Gets vault via vault address (address of the vault in their chain, most probably unique)
const getQiVault = async (vaultAddress: string) => (await getConnection().manager.find(QiVault, { where: { vaultAddress: vaultAddress } }))[0];

// Gets vault data based from what vault it is and its id on chain (not the id, don't be mistaken, vaultId is based from the chain)
const getQiVaultData = async (vault: QiVault, vaultId: number) => (await getConnection().manager.find(QiVaultData, { where: { vaultId: vaultId, vault: { id: vault.id } }, relations: ['vault'] }))[0];

const safeConvertBigNumberToNumber = (n: BigNumber) => {
    try {
        return n.toNumber();
    } catch (error) {
        return 0;
    }
};

const listenToCreateVault = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault } = params;
    const log = LoggerSingleton.getInstance();

    // contract.on works
    contractListener.onVaultCreated(async (id, ownerAddress) => {
        log.info(`Vault ${vault.name} # ${id} Created by ${ownerAddress}`);

        const qiVault = await getQiVault(vault.address);

        getConnection().manager.save(QiVaultData, {
            owner: ownerAddress,
            vaultId: id.toNumber(),
            vault: qiVault,
            collateralRatio: 0,
            collateralAmount: '0',
            maiDebt: '0',
            predictedCollateralAmount: '0',
            predictedCollateralRatio: 0,
            predictedTotalCollateralValue: '0',
            totalCollateralValue: '0',
        })
    });
}

const listenToCollateralDeposits = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    const log = LoggerSingleton.getInstance();

    // contract.on works
    contractListener.onCollateralDeposited(async (id, amount) => {
        const logMessage = `Vault ${vault.name} # ${id} Deposited ${ethers.utils.commify(ethers.utils.formatEther(amount))}`

        const qiVault = await getQiVault(vault.address);
        const vaultData = await getQiVaultData(qiVault, id.toNumber());

        if (!vaultData) {
            log.silly(`${logMessage} but it hasn't been synced yet 😥`)
            return;
        } else {
            log.info(logMessage);
        }

        // TODO: update algorithm to include latest dollar price of asset?
        const predictedCollateralAmount = BigNumber.from(vaultData.predictedCollateralAmount).add(amount);
        const predictedCollateralValue = await contractGateway.calculatePredictedVaultAmount(predictedCollateralAmount, BigNumber.from(qiVault.dollarValue));
        
        let predictedDebtRatio = BigNumber.from(0);

        try {
            predictedDebtRatio = predictedCollateralValue.mul(100).div(BigNumber.from(vaultData.maiDebt).mul(100000000));
        } catch (E) {
            log.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
            log.prettyError(E);
        }

        getConnection().manager.update(QiVaultData, vaultData.id, {
            predictedCollateralAmount: predictedCollateralAmount.toString(),
            predictedCollateralRatio: safeConvertBigNumberToNumber(predictedDebtRatio),
            predictedTotalCollateralValue: predictedCollateralValue.toString(),
        })
    });
}

const listenToCollateralWithdrawals = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    const log = LoggerSingleton.getInstance();

    // contract.on works
    contractListener.onCollateralWithdrawn(async (id, amount) => {
        const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

        const qiVault = await getQiVault(vault.address);
        const vaultData = await getQiVaultData(qiVault, id.toNumber());

        if (!vaultData) {
            log.silly(`${logMessage} but it hasn't been synced yet 😥`)
            return;
        } else {
            log.info(logMessage);
        }

        // TODO: update algorithm to include latest dollar price of asset?
        const predictedCollateralAmount = BigNumber.from(vaultData.predictedCollateralAmount).sub(amount);
        const predictedCollateralValue = await contractGateway.calculatePredictedVaultAmount(predictedCollateralAmount, BigNumber.from(qiVault.dollarValue));
        let predictedDebtRatio = BigNumber.from(0)

        try {
            predictedDebtRatio = predictedCollateralValue.mul(100).div(BigNumber.from(vaultData.maiDebt).mul(100000000));
        } catch (E) {
            log.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
            log.prettyError(E);
        }


        // Make a guess work for now, on deposit update predicted values,
        getConnection().manager.update(QiVaultData, vaultData.id, {
            predictedCollateralAmount: predictedCollateralAmount.toString(),
            predictedCollateralRatio: safeConvertBigNumberToNumber(predictedDebtRatio),
            predictedTotalCollateralValue: predictedCollateralValue.toString(),
        })
    });
}

const listenToTokenBorrows = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    const log = LoggerSingleton.getInstance();

    contractListener.onTokenBorrow(async (id, amount) => {
        const logMessage = `Vault ${vault.name} # ${id} Withdrawn ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

        const qiVault = await getQiVault(vault.address);
        const vaultData = await getQiVaultData(qiVault, id.toNumber());

        if (!vaultData) {
            log.silly(`${logMessage} but it hasn't been synced yet 😥`)
            return;
        } else {
            log.info(logMessage);
        }

        // TODO: update algorithm to include latest dollar price of asset?
        const newMaiDebt = BigNumber.from(vaultData.maiDebt).add(amount);
        let predictedDebtRatio = BigNumber.from(0)

        try {
            predictedDebtRatio = BigNumber.from(vaultData.predictedCollateralAmount).mul(100).div(BigNumber.from(newMaiDebt).mul(100000000));

        } catch (E) {
            log.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
            log.prettyError(E);
        }

        // Make a guess work for now, on deposit update predicted values,
        getConnection().manager.update(QiVaultData, vaultData.id, {
            predictedCollateralRatio: safeConvertBigNumberToNumber(predictedDebtRatio),
            maiDebt: newMaiDebt.toString(),
        })
    });
}

const listenToTokenRepayments = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    const log = LoggerSingleton.getInstance();

    contractListener.onTokenRepaid(async (id, amount, closingFee) => {
        const logMessage = `Vault ${vault.name} # ${id} Repayed ${ethers.utils.commify(ethers.utils.formatEther(amount))}`;

        const qiVault = await getQiVault(vault.address);
        const vaultData = await getQiVaultData(qiVault, id.toNumber());

        if (!vaultData) {
            log.silly(`${logMessage} but it hasn't been synced yet 😥`)
            return;
        } else {
            log.info(logMessage);
        }

        // TODO: update algorithm to include latest dollar price of asset?
        const newMaiDebt = BigNumber.from(vaultData.maiDebt).sub(amount);
        const predictedCollateralAmount = BigNumber.from(vaultData.collateralAmount).sub(BigNumber.from(closingFee));
        const predictedCollateralValue = await contractGateway.calculatePredictedVaultAmount(predictedCollateralAmount, BigNumber.from(qiVault.dollarValue));

        let predictedDebtRatio = BigNumber.from(0)

        try {
            predictedDebtRatio = predictedCollateralValue.mul(100).div(BigNumber.from(newMaiDebt).mul(100000000));
        } catch (E) {
            log.error('Div by zero error, check maiDebt of ' + JSON.stringify(vaultData))
            log.prettyError(E);
        }

        // Make a guess work for now, on deposit update predicted values,

        getConnection().manager.update(QiVaultData, vaultData.id, {
            predictedCollateralRatio: safeConvertBigNumberToNumber(predictedDebtRatio),
            predictedTotalCollateralValue: predictedCollateralValue.toString(),
            predictedCollateralAmount: predictedCollateralAmount.toString(),
            maiDebt: newMaiDebt.toString(),
        })
    });
}


const listenToVaultLiquidations = (params: ListenerParams) => {
    const { vaultListener: contractListener, vault, vaultService: contractGateway } = params;
    const log = LoggerSingleton.getInstance();

    contractListener.onLiquidateVault(async (id, amount, buyer) => {
        const logMessage = `Vault ${vault.name} # ${id} Liquidated by ${buyer}`;

        const qiVault = await getQiVault(vault.address);
        const vaultUserData: IQiDaoVaultData = await contractGateway.getVaultUserData(id.toNumber()).catch(() => null);

        if (!vaultUserData) {
            log.silly(`${logMessage} but it hasn't been synced yet 😥`)
            return;
        } else {
            log.info(logMessage);
        }


        if (vaultUserData) {
            updateVaultUserData({
                collateralAmount: vaultUserData.collateralAmount.toString(),
                collateralRatio: vaultUserData.collateralRatio.lt(1000) ? vaultUserData.collateralRatio.toNumber() : 1000,
                maiDebt: vaultUserData.maiDebt.toString(),
                owner: vaultUserData.owner,
                totalCollateralValue: vaultUserData.collateralTotalAmount.toString(),
                vault: qiVault,
                vaultId: qiVault.id
            })
        }
    });
}