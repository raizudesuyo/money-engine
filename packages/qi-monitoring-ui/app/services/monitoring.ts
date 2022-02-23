export const getLiquidationVaultData = async (): Promise<VaultDataOnlyResult> =>  {
    return (await fetch('http://localhost:7070/vault-data?pageSize=20', {
        method: 'GET'
    })).json();
}

export const getAllVaults = async (): Promise<VaultsResult> => {
    return (await fetch('http://localhost:7070/vaults', {
        method: 'GET'
    })).json();
}

export const getVault100 = async (vaultId: number): Promise<VaultDataOnlyResult> => {
    return (await fetch(`http://localhost:7070/vaults/${vaultId}?pageSize=100&pageNumber=0`)).json()
}

// @region mappings, copy pasted from backend
export interface VaultsResult {
    vaults: QiVault[],
    pageCount: number
}

export interface VaultDataResult {
    vault: QiVault,
    vaultData: QiVaultData[],
    pageCount: number
}

export interface VaultDataOnlyResult {
    vaultData: QiVaultData[],
    pageCount: number
}

export type QiVault = {
    id: number;
    vaultName: string;
    tokenAddress: string;
    tokenSymbol: string;
    vaultAddress: string;
    dollarValue: string;
    priceOracleAddress: string;
    minimumRatio: number;
    gainRatio: number;
    canPublicLiquidate: boolean;
    updatedTime: Date;
}

export type QiVaultData = {
    id: number;
    vaultId: number;
    collateralRatio: number;
    collateralAmount: string;
    totalCollateralValue: string;
    maiDebt: string;
    predictedCollateralRatio: number;
    predictedCollateralAmount: string;
    predictedTotalCollateralValue: string;
    owner: string;
    otherData: any;
    qiVaultId: number;
    updateTime: Date;
    predictionUpdateTime: Date;
}

export type SortType = 'none' | 'id' | 'debtRatio'
//