import { IQiDaoVaultContractAdapter, ContractTransactionParams } from '../IQiDaoVaultContractAdapter';
import { BigNumber, providers } from 'ethers';
import { CrosschainQiStablecoinV2, CrosschainQiStablecoinV2__factory } from '../../../../../typechain';

export class CrosschainQiStablecoinV2Service implements IQiDaoVaultContractAdapter {

    private smartContract: CrosschainQiStablecoinV2; 

    constructor(contractAddress: string, provider: providers.BaseProvider) {
        this.smartContract = CrosschainQiStablecoinV2__factory.connect(contractAddress, provider);
    }
    
    _minimumCollateralPercentage = () => this.smartContract._minimumCollateralPercentage()
    
    vaultCount = () => this.smartContract.vaultCount();

    closingFee = () => this.smartContract.closingFee();

    openingFee = () => this.smartContract.closingFee();

    treasury = () => this.smartContract.treasury();

    tokenPeg = () => this.smartContract.tokenPeg();

    vaultCollateral = (vaultId: number) => this.smartContract.vaultCollateral(vaultId);

    vaultDebt = (vaultId: number) => this.smartContract.vaultDebt(vaultId);

    debtRatio = () => this.smartContract.debtRatio();

    gainRatio = () => this.smartContract.gainRatio();
    
    stabilityPool = () => this.smartContract.stabilityPool();

    collateral = () => this.smartContract.collateral();

    priceSourceDecimals = async () => BigNumber.from(8);

    getDebtCeiling = () => this.smartContract.getDebtCeiling();

    exists = (vaultId: number) => this.smartContract.exists(vaultId);

    getClosingFee = () => this.smartContract.getClosingFee();

    getOpeningFee = async () => BigNumber.from(0);

    getTokenPriceSource = () => this.smartContract.getTokenPriceSource();

    getEthPriceSource = () => this.smartContract.getEthPriceSource();

    createVault = (overrides?: ContractTransactionParams) => this.smartContract.createVault(overrides)

    destroyVault = (vaultId: number, overrides?: ContractTransactionParams) => this.smartContract.destroyVault(vaultId, overrides)

    depositCollateral = (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.depositCollateral(vaultID, amount, overrides);

    withdrawCollateral = (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.withdrawCollateral(vaultID, amount, overrides);

    borrowToken = () => (vaultID: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.borrowToken(vaultID, amount, overrides);;

    payBackToken = (vaultId: number, amount: BigNumber, overrides?: ContractTransactionParams) => this.smartContract.payBackToken(vaultId, amount, overrides);

    getPaid = () => this.smartContract.getPaid();

    checkCost = (vaultId: number) => this.smartContract.checkCost(vaultId);

    checkExtract = (vaultId: number) => this.smartContract.checkExtract(vaultId);

    checkCollateralPercentage = (vaultId: number) => this.smartContract.checkCollateralPercentage(vaultId);

    checkLiquidation = (vaultId: number) => this.smartContract.checkLiquidation(vaultId);

    liquidateVault = (vaultId: number, overrides?: ContractTransactionParams) => this.smartContract.liquidateVault(vaultId, overrides);
    
    ethPriceSource = () => this.smartContract.ethPriceSource();

    ownerOf = (vaultId: number) => this.smartContract.ownerOf(vaultId);

    amountDecimals = async () => BigNumber.from(18);
}