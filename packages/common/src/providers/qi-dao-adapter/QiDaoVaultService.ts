import { ethers } from 'ethers';
import { IQiDaoVaultService, IQiDaoVault, IQiDaoVaultData } from './IQiDaoVaultContract';
import { IQiDaoVaultContractAdapter } from './smart-contract-service/IQiDaoVaultContractAdapter';
import { MaiVaultContractType } from '../../interfaces/data';
import { BigNumberMath } from '../../helpers';

export interface Erc20QiStablecoinProviderConstructorParams {
    contractType: MaiVaultContractType
    contractAddress: string
    contractProvider: ethers.AbstractProvider
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
    
    getVaultUserData = async (vaultNumber: number): Promise<IQiDaoVaultData> => {
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
    calculatePredictedVaultAmount = async (collateralAmount: bigint, tokenDollarValue: bigint): Promise<bigint> => {

        const targetDecimal = BigInt(18);

        const collateralDecimalAmount = this.smartContractAdapter.amountDecimals();
        const priceSourceDecimals = this.smartContractAdapter.priceSourceDecimals();

        // If collateralized amount is already 18, it will result the same, anything to the power of 0 is 1
        // Result should be collateral amount with 18 decimals
        const normalizedCollateralAmount = collateralAmount * BigNumberMath.pow(BigInt(10), targetDecimal - await collateralDecimalAmount)
        const normalizedDollarValue = tokenDollarValue * BigNumberMath.pow(BigInt(10), targetDecimal - await priceSourceDecimals)

        const to18th = BigNumberMath.pow(BigInt(10), targetDecimal)
        const result = (normalizedDollarValue * normalizedCollateralAmount) / to18th;
        return result;
    }

    getSmartContract = (): IQiDaoVaultContractAdapter => this.smartContractAdapter; 

}