import { QiStablecoin, QiStablecoin__factory } from '../../../../../typechain';
import { IQiDaoVaultContractAdapter, ContractTransactionParams } from '../IQiDaoVaultContractAdapter';
import { AbstractProvider } from 'ethers';

// Actually an Adapter
export class QiStableCoinService implements IQiDaoVaultContractAdapter {

    private smartContract: QiStablecoin; 

    constructor(contractAddress: string, provider: AbstractProvider) {
        this.smartContract = QiStablecoin__factory.connect(contractAddress, provider);
    }
    
    _minimumCollateralPercentage = async () => BigInt(130); //  minimum collateral percentage is a private property
    
    vaultCount = () => this.smartContract.vaultCount();

    closingFee = () => this.smartContract.closingFee();

    openingFee = () => this.smartContract.closingFee();

    treasury = () => this.smartContract.treasury();

    tokenPeg = () => this.smartContract.tokenPeg();

    vaultCollateral = (vaultId: number) => this.smartContract.vaultCollateral(vaultId);

    vaultDebt = (vaultId: number) => this.smartContract.vaultDebt(vaultId);

    debtRatio = async () => BigInt(-1);

    gainRatio = async () => BigInt(-1);
    
    stabilityPool = () => this.smartContract.stabilityPool();

    collateral = async () => "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";

    priceSourceDecimals = async () => BigInt(8);

    getDebtCeiling = () => this.smartContract.getDebtCeiling();

    exists = (vaultId: number) => this.smartContract.vaultExistence(vaultId);

    getClosingFee = () => this.smartContract.getClosingFee();

    getOpeningFee = () => this.smartContract.getOpeningFee();

    getTokenPriceSource = () => this.smartContract.getTokenPriceSource();

    getEthPriceSource = () => this.smartContract.getEthPriceSource();

    createVault = (overrides?: ContractTransactionParams) => this.smartContract.createVault()

    destroyVault = (vaultId: number, overrides?: ContractTransactionParams) => this.smartContract.destroyVault(vaultId, overrides)

    depositCollateral = (vaultID: number, amount: BigInt, overrides?: ContractTransactionParams) => { throw new Error('Not Implemented') };

    withdrawCollateral = (vaultID: number, amount: BigInt, overrides?: ContractTransactionParams) => this.smartContract.withdrawCollateral(vaultID, amount.toString());

    borrowToken = () => (vaultID: number, amount: BigInt, overrides?: ContractTransactionParams) => this.smartContract.borrowToken(vaultID, amount.toString());

    payBackToken = (vaultId: number, amount: BigInt, overrides?: ContractTransactionParams) => this.smartContract.payBackToken(vaultId, amount.toString());

    getPaid = () => { throw new Error('Not Implemented') }

    checkCost = (vaultId: number) => { throw new Error('Not Implemented') }

    checkExtract = (vaultId: number) => { throw new Error('Not Implemented') }

    checkCollateralPercentage = async (vaultId: number) => { 
        // Perform math manually

        const collateralAmount = this.vaultCollateral(vaultId);
        const maiDebt = this.vaultDebt(vaultId);
        const getEthPriceSource = this.getEthPriceSource();
        const getTokenPriceSource = this.getTokenPriceSource()

        const collateralValue = (await collateralAmount) * (await getEthPriceSource)
        const debtValue = (await maiDebt) * (await getTokenPriceSource);

        if(debtValue === BigInt(0)) return BigInt(0);

        return (collateralValue * BigInt(100)) / debtValue
    }

    checkLiquidation = async (vaultId: number) => 
        (await this.checkCollateralPercentage(vaultId)) < (await this._minimumCollateralPercentage());

    liquidateVault = (vaultId: number, overrides?: ContractTransactionParams) => { throw new Error('Not Implemented') }

    ethPriceSource = () => this.smartContract.ethPriceSource();

    ownerOf = (vaultId: number) => this.smartContract.vaultOwner(vaultId);

    amountDecimals = async () => BigInt(18);
}