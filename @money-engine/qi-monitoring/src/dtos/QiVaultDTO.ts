
import { QiVaultDataDTO } from './QiVaultDataDTO'
import { BigNumber } from 'ethers';

export class QiVaultDTO {

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
    vaultData?: QiVaultDataDTO[]

}
