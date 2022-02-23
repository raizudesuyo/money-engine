// A Strategy actually

import { BigNumber } from "ethers"
import { IQiDaoVaultContractAdapter } from "./smart-contract-service/IQiDaoVaultContractAdapter";

export interface IQiDaoVaultService {
    /**
     * get the overarching vault data.
     */
    getVault: () => Promise<IQiDaoVault>
    
    getVaultUserData: (vaultId: number) => Promise<IQiDaoVaultData | false> 

    calculatePredictedVaultAmount: (collateralAmount: BigNumber, tokenDollarValue: BigNumber) => Promise<BigNumber>

    getSmartContract: () => IQiDaoVaultContractAdapter
}

export interface IQiDaoVaultData {
    collateralRatio: BigNumber
    collateralAmount: BigNumber
    collateralTotalAmount: BigNumber
    owner: string
    maiDebt: BigNumber
}

export interface IQiDaoVault {
    tokenAddress: string
    priceOracleAddress: string // can actually be an address
    dollarValue: BigNumber
    vaultCount: BigNumber
    stabilityPoolAddress: string 
    gainRatio: BigNumber
    minimumRatio: BigNumber
}