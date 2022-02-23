import { ethers, BigNumber, providers } from 'ethers';
import { IQiDaoVaultService, IQiDaoVault, IQiDaoVaultData } from './IQiDaoVaultContract';
import { IQiDaoVaultContractAdapter } from './smart-contract-service/IQiDaoVaultContractAdapter';
import { MaiVaultContractType } from 'qi-common/interfaces/data';

export interface Erc20QiStablecoinProviderConstructorParams {
    contractType: MaiVaultContractType
    contractAddress: string
    contractProvider: ethers.providers.BaseProvider
}

export class QiDaoVaultService implements IQiDaoVaultService {

    constructor(
        private smartContractAdapter: IQiDaoVaultContractAdapter
    ) { }

    getVault = async (): Promise<IQiDaoVault> => {
        const tokenAddressPromise = this.smartContractAdapter.collateral(); // returns the address of the collateral token
        const priceOracleAddressPromise = this.smartContractAdapter.ethPriceSource();
        const dollarValuePromise = this.smartContractAdapter.getEthPriceSource()
        const vaultCountPromise = this.smartContractAdapter.vaultCount()
        const stabilityPoolAddressPromise = this.smartContractAdapter.stabilityPool()
        const gainRatioPromise = this.smartContractAdapter.gainRatio()
        const minimumRatioPromise = this.smartContractAdapter._minimumCollateralPercentage()
    
        const [ 
            tokenAddress,
            priceOracleAddress,
            dollarValue,
            vaultCount,
            stabilityPoolAddress,
            gainRatio,
            minimumRatio
        ] = await Promise.all([
            tokenAddressPromise,
            priceOracleAddressPromise,
            dollarValuePromise,
            vaultCountPromise,
            stabilityPoolAddressPromise,
            gainRatioPromise,
            minimumRatioPromise
        ]);

        return {
            tokenAddress,
            priceOracleAddress,
            dollarValue,
            vaultCount,
            stabilityPoolAddress,
            gainRatio,
            minimumRatio
        }
    }
    
    getVaultUserData = async (vaultId: number): Promise<false | IQiDaoVaultData> => {
        const collateralRatioPromise = this.smartContractAdapter.checkCollateralPercentage(vaultId);
        const collateralAmountPromise = this.smartContractAdapter.vaultCollateral(vaultId);
        const ownerPromise = this.smartContractAdapter.ownerOf(vaultId);
        const maiDebtPromise = this.smartContractAdapter.vaultDebt(vaultId);
        const dollarValuePromise = this.smartContractAdapter.getEthPriceSource()

        const [ 
            collateralRatio,
            collateralAmount,
            owner,
            maiDebt,
            dollarValue
        ] = await Promise.all([
            collateralRatioPromise,
            collateralAmountPromise,
            ownerPromise,
            maiDebtPromise,
            dollarValuePromise
        ]);

        return {
            collateralRatio,
            collateralAmount,
            owner,
            maiDebt,
            collateralTotalAmount: await this.calculatePredictedVaultAmount(collateralAmount, dollarValue)
        }
    }

    // Returns in ether value, has 18 decimals
    calculatePredictedVaultAmount = async (collateralAmount: BigNumber, tokenDollarValue: BigNumber): Promise<BigNumber> => {

        const targetDecimal = BigNumber.from(18);

        // If collateralized amount is already 18, it will result the same, anything to the power of 0 is 1
        const normalizedCollateralAmount = collateralAmount.mul(
            BigNumber.from(10).pow(targetDecimal).sub(BigNumber.from(await this.smartContractAdapter.amountDecimals()))
        );

        const normalizedDollarValue = tokenDollarValue.mul(
            BigNumber.from(10).pow(targetDecimal).sub(BigNumber.from(await this.smartContractAdapter.priceSourceDecimals()))
        );

        return (normalizedDollarValue.mul(normalizedCollateralAmount)).div(BigNumber.from(10).pow(targetDecimal));
    }

    getSmartContract = (): IQiDaoVaultContractAdapter => this.smartContractAdapter; 

}