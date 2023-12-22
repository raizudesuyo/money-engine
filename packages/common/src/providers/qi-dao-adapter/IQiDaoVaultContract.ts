// A Strategy actually

import { IQiDaoVaultContractAdapter } from "./smart-contract-service/IQiDaoVaultContractAdapter";

export interface IQiDaoVaultService {
    /**
     * get the overarching vault data.
     */
    getVault: () => Promise<IQiDaoVault>
    
    getVaultUserData: (vaultId: number) => Promise<IQiDaoVaultData> 

    calculatePredictedVaultAmount: (collateralAmount: bigint, tokenDollarValue: bigint) => Promise<bigint>

    getSmartContract: () => IQiDaoVaultContractAdapter
}

export interface IQiDaoVaultData {
    collateralRatio: bigint
    collateralAmount: bigint
    collateralTotalAmount: bigint
    owner: string
    maiDebt: bigint
}

export interface IQiDaoVault {
    tokenAddress: string
    priceOracleAddress: string // can actually be an address
    dollarValue: bigint
    vaultCount: bigint
    stabilityPoolAddress: string 
    gainRatio: bigint
    minimumRatio: bigint
}