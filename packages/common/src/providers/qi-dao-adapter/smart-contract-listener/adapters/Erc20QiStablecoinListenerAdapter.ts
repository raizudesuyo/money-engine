import { AbstractProvider } from 'ethers';
import { IQiDaoSmartContractListener } from '../IQiDaoSmartContractListener';
import { Erc20QiStablecoin, Erc20QiStablecoin__factory } from '../../../../../typechain';

export class Erc20QiStablecoinListenerAdapter implements IQiDaoSmartContractListener {

    protected smartContract: Erc20QiStablecoin;

    constructor(
        contractAddress: string, 
        provider: AbstractProvider) {
        this.smartContract = Erc20QiStablecoin__factory.connect(contractAddress, provider);
    }

    onVaultCreated = async (listener: (id: bigint, ownerAddress: string) => Promise<void>) => {
        const filter = this.smartContract.filters.CreateVault(null, null);

        this.smartContract.on(filter, listener);
    };

    onCollateralDeposited = async (listener: (id: bigint, amount: bigint) => Promise<void>) => {
        const filter = this.smartContract.filters.DepositCollateral(null, null);

        this.smartContract.on(filter, listener);
    }

    onCollateralWithdrawn = async (listener: (id: bigint, amount: bigint) => Promise<void>) => {
        const filter = this.smartContract.filters.WithdrawCollateral(null, null);

        this.smartContract.on(filter, listener);
    }

    onTokenBorrow = async (listener: (id: bigint, amount: bigint) => Promise<void>) => {
        const filter = this.smartContract.filters.BorrowToken(null, null);

        this.smartContract.on(filter, listener);
    }

    onTokenRepaid = async (listener: (id: bigint, amount: bigint, closingFee: bigint) => Promise<void>) => {
        const filter = this.smartContract.filters.PayBackToken(null, null, null);

        this.smartContract.on(filter, listener);
    };

    onLiquidateVault = async (listener: (id: bigint, owner: string, buyer: string, debtRepaid: bigint, collateralLiquidated: bigint, closingFee: bigint) => Promise<void>) => {
        const filter = this.smartContract.filters.LiquidateVault(null, null, null, null, null, null);

        this.smartContract.on(filter, listener);
    };

}