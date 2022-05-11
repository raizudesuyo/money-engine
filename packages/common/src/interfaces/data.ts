export interface IData {
    maiVaultContracts: IMaiVaultContractData[]
}

export interface IMaiVaultContractData {
    name: string;
    address: string;
    chain: string
    type: MaiVaultContractType
}

export type MaiVaultContractType = 'erc20QiStablecoin' 
    | 'erc20QiStablecoinwbtc' 
    | 'erc20QiStablecoincamwbtc' 
    | 'crosschainQiStablecoin'
    | 'crosschainQiStablecoinwbtc'
    | 'crosschainNativeQiStablecoin'
    | 'crosschainQiStablecoinV2' 
    | 'QiStablecoin'
