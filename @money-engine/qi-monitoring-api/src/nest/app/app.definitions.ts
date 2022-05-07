import { QiVault } from "qi-db/src/entity/QiVault.entity"
import { QiVaultData } from "qi-db/src/entity/QiVaultData.entity"

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

export type SortType = 'none' | 'id' | 'debtRatio'