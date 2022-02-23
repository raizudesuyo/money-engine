import { BigNumber } from 'ethers';
import { QiVault, QiVaultData } from 'qi-db';
import { getConnection } from 'typeorm'

export interface UpdateVaultParams {
    vaultName?: string
    tokenAddress?: string
    tokenSymbol?: string
    priceOracleAddress?: string
    dollarValue: string
    canPublicLiquidate?: boolean
    gainRatio?: BigNumber
    minimumRatio?: BigNumber
    vaultAddress: string
    vaultChain: string
}

export const updateVaultData = async (params: UpdateVaultParams): Promise<QiVault> => {

    const manager = getConnection().manager;

    const {
        vaultName,
        tokenAddress,
        priceOracleAddress,
        dollarValue,
        tokenSymbol,
        canPublicLiquidate,
        gainRatio,
        minimumRatio,
        vaultAddress,
        vaultChain
    } = params;

    let vault = manager.find(QiVault, {
        where: {
            tokenAddress: params.tokenAddress
        },
    })[0]

    const gainRationAsNumber = gainRatio.toNumber();
    const minimumRatioAsNumber = minimumRatio.toNumber();

    if (!vault) {
        vault = await manager.create(QiVault, {
            vaultName,
            tokenAddress,
            tokenSymbol,
            dollarValue,
            vaultAddress,
            gainRatio: gainRationAsNumber,
            minimumRatio: minimumRatioAsNumber,
            priceOracleAddress,
            canPublicLiquidate,
            vaultChain,
        });
    } else {
        vault.dollarValue = dollarValue;
    }

    return manager.save(vault)
}

export interface UpdateVaultDataParams {
    vaultId: number
    collateralRatio: number,
    collateralAmount: string,
    totalCollateralValue: string,
    maiDebt: string,
    owner: string
    vault: QiVault
}

export const updateVaultUserData = async (params: UpdateVaultDataParams) => {

    const manager = getConnection().manager;

    const { 
        vaultId,
        collateralRatio,
        collateralAmount,
        totalCollateralValue,
        maiDebt,
        owner,
        vault
    } = params;

    let vaultData = (await manager.find(QiVaultData, {
        where: {
            vault: { vaultName: vault.vaultName },
            vaultId: vaultId
        },
        relations: ['vault']
    }))[0]

    if (!vaultData) {
        vaultData = manager.create(QiVaultData, {
            collateralRatio,
            collateralAmount,
            totalCollateralValue,
            maiDebt,
            owner,
            predictedCollateralRatio: collateralRatio,
            predictedCollateralAmount: collateralAmount,
            predictedTotalCollateralValue: totalCollateralValue,
            vaultId,
            vault
        })
    } else {
        vaultData.predictedCollateralRatio = collateralRatio;
        vaultData.predictedCollateralAmount = collateralAmount;
        vaultData.predictedTotalCollateralValue = totalCollateralValue;
        vaultData.maiDebt = maiDebt
    }

    return manager.save(vaultData)
}
