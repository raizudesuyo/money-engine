import { QiStablecoin, QiStablecoin__factory } from '../../../../../typechain';
import { IQiDaoVaultContractAdapter, ContractTransactionParams } from '../IQiDaoVaultContractAdapter';
import { BigNumber, providers } from 'ethers';

export class QiStableCoinService implements IQiDaoVaultContractAdapter {

    private smartContract: QiStablecoin; 

    constructor(contractAddress: string, provider: providers.BaseProvider) {
        this.smartContract = QiStablecoin__factory.connect(contractAddress, provider);
    }
    
    _minimumCollateralPercentage = async () => BigNumber.from(130); //  minimum collateral percentage is a private property
    
    vaultCount = () => this.smartContract.vaultCount();

    closingFee = () => this.smartContract.closingFee();

    openingFee = () => this.smartContract.closingFee();

    treasury = () => this.smartContract.treasury();

    tokenPeg = () => this.smartContract.tokenPeg();

    vaultCollateral = (vaultId: number) => this.smartContract.vaultCollateral(vaultId);

    vaultDebt = (vaultId: number) => this.smartContract.vaultDebt(vaultId);

    debtRatio = async () => BigNumber.from(-1);

    gainRatio = async () => BigNumber.from(-1);
    
    stabilityPool = () => this.smartContract.stabilityPool();

    collateral = async () => "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

    priceSourceDecimals = async () => BigNumber.from(8);

    getDebtCeiling = () => this.smartContract.getDebtCeiling();

    exists = (vaultId: number) => this.smartContract.vaultExistence(vaultId);

    getClosingFee = () => this.smartContract.getClosingFee();

    getOpeningFee = () => this.smartContract.getOpeningFee();

    getTokenPriceSource = () => this.smartContract.getTokenPriceSource();

    getEthPriceSource = () => this.smartContract.getEthPriceSource();

    createVault = (overrides?: ContractTransactionParams) => this.smartContract.createVault(overrides)

    destroyVault = (vaultId: number, overrides?: ContractTransactionParams) => this.smartContract.destroyVault(vaultId, overrides)

    depositCollateral = (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => { throw new Error('Not Implemented') };

    withdrawCollateral = (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.withdrawCollateral(vaultID, amount, overrides);

    borrowToken = () => (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.borrowToken(vaultID, amount, overrides);;

    payBackToken = (vaultId: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.payBackToken(vaultId, amount, overrides);

    getPaid = () => { throw new Error('Not Implemented') }

    checkCost = (vaultId: number) => { throw new Error('Not Implemented') }

    checkExtract = (vaultId: number) => { throw new Error('Not Implemented') }

    checkCollateralPercentage = async (vaultId: number) => { 
        // Perform math manually

        const collateralAmount = this.vaultCollateral(vaultId);
        const maiDebt = this.vaultDebt(vaultId);
        const getEthPriceSource = this.getEthPriceSource();
        const getTokenPriceSource = this.getTokenPriceSource()

        const collateralValue = (await collateralAmount).mul(await getEthPriceSource)
        const debtValue = (await maiDebt).mul(await getTokenPriceSource);

        if(debtValue.isZero()) return BigNumber.from(0);

        return (collateralValue.mul(100).div(debtValue))
    }

    checkLiquidation = async (vaultId: number) => 
        (await this.checkCollateralPercentage(vaultId)).lt(await this._minimumCollateralPercentage());

    liquidateVault = (vaultId: number, overrides?: ContractTransactionParams) => { throw new Error('Not Implemented') }

    ethPriceSource = () => this.smartContract.ethPriceSource();

    ownerOf = (vaultId: number) => this.smartContract.vaultOwner(vaultId);

    amountDecimals = async () => BigNumber.from(18);
}