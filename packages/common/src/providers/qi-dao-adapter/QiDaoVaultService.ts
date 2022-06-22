import { ethers, BigNumber } from 'ethers';
import { IQiDaoVaultService, IQiDaoVault, IQiDaoVaultData } from './IQiDaoVaultContract';
import { IQiDaoVaultContractAdapter } from './smart-contract-service/IQiDaoVaultContractAdapter';
import { MaiVaultContractType } from '../../interfaces/data';

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
        const tokenAddress = this.smartContractAdapter.collateral() // returns the address of the collateral token
        const priceOracleAddress = this.smartContractAdapter.ethPriceSource()
        const dollarValue = this.smartContractAdapter.getEthPriceSource()
        const vaultCount = this.smartContractAdapter.vaultCount()
        const stabilityPoolAddress = this.smartContractAdapter.stabilityPool()
        const gainRatio = this.smartContractAdapter.gainRatio()
        const minimumRatio = this.smartContractAdapter._minimumCollateralPercentage()
    
        return {
            tokenAddress: await tokenAddress,
            priceOracleAddress: await priceOracleAddress,
            dollarValue: await dollarValue,
            vaultCount: await vaultCount,
            stabilityPoolAddress: await stabilityPoolAddress,
            gainRatio: await gainRatio,
            minimumRatio: await minimumRatio
        }
    }
    
    getVaultUserData = async (vaultNumber: number): Promise<false | IQiDaoVaultData> => {
        const collateralRatioPromise = this.smartContractAdapter.checkCollateralPercentage(vaultNumber);
        const collateralAmountPromise = this.smartContractAdapter.vaultCollateral(vaultNumber);
        const ownerPromise = this.smartContractAdapter.ownerOf(vaultNumber);
        const maiDebtPromise = this.smartContractAdapter.vaultDebt(vaultNumber);
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