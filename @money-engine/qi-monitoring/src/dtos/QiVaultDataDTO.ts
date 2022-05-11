import { QiVaultDTO } from "./QiVaultDTO";
import { BigNumber } from 'ethers';

export interface QiVaultDataDTO {
    id?: number
    collateralRatio: number;
    collateralAmount: BigNumber;
    totalCollateralValue: BigNumber;
    maiDebt: BigNumber;
    owner: string;
    vault?: QiVaultDTO
    vaultId?: number
}
