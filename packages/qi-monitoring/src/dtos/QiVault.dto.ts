
import { QiVaultData } from './QiVaultData.dto'

export class QiVault {

    uuid?: string;
    name: string;
    chain: string;
    tokenAddress: string;
    tokenSymbol: string;
    vaultAddress: string;
    dollarValue: string;
    priceOracleAddress: string;
    minimumRatio: number;
    gainRatio: number;
    canPublicLiquidate: boolean;
    vaultData?: QiVaultData[]

}
