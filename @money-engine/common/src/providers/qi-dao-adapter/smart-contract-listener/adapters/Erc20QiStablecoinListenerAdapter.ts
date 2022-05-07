import { BigNumber, providers } from 'ethers';
import { IQiDaoSmartContractListener } from '../IQiDaoSmartContractListener';
import { Erc20QiStablecoin, Erc20QiStablecoin__factory } from '../../../../../typechain';

export class Erc20QiStablecoinListenerAdapter implements IQiDaoSmartContractListener {

    protected smartContract: Erc20QiStablecoin;

    constructor(
        contractAddress: string, 
        provider: providers.BaseProvider) {
        this.smartContract = Erc20QiStablecoin__factory.connect(contractAddress, provider);
    }

    onVaultCreated = async (listener: (id: BigNumber, ownerAddress: string) => Promise<void>) => {
        const filter = this.smartContract.filters.CreateVault(null, null);

        this.smartContract.on(filter, listener);
    };

    onCollateralDeposited = async (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => {
        const filter = this.smartContract.filters.DepositCollateral(null, null);

        this.smartContract.on(filter, listener);
    }

    onCollateralWithdrawn = async (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => {
        const filter = this.smartContract.filters.WithdrawCollateral(null, null);

        this.smartContract.on(filter, listener);
    }

    onTokenBorrow = async (listener: (id: BigNumber, amount: BigNumber) => Promise<void>) => {
        const filter = this.smartContract.filters.BorrowToken(null, null);

        this.smartContract.on(filter, listener);
    }

    onTokenRepaid = async (listener: (id: BigNumber, amount: BigNumber, closingFee: BigNumber) => Promise<void>) => {
        const filter = this.smartContract.filters.PayBackToken(null, null, null);

        this.smartContract.on(filter, listener);
    };

    onLiquidateVault = async (listener: (id: BigNumber, owner: string, buyer: string, debtRepaid: BigNumber, collateralLiquidated: BigNumber, closingFee: BigNumber) => Promise<void>) => {
        const filter = this.smartContract.filters.LiquidateVault(null, null, null, null, null, null);

        this.smartContract.on(filter, listener);
    };

}