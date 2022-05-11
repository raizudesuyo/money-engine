
import { QiVaultData } from './QiVaultData.dto'
import { BigNumber } from 'ethers';

export class QiVault {

    id?: number;
    name: string;
    chain: string;
    tokenAddress: string;
    tokenSymbol: string;
    vaultAddress: string;
    dollarValue: BigNumber;
    priceOracleAddress: string;
    minimumRatio: number;
    gainRatio: number;
    canPublicLiquidate: boolean;
    vaultData?: QiVaultData[]

}
