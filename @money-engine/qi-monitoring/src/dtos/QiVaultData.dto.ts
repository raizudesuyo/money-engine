import { QiVault } from "./QiVault.dto";
import { BigNumber } from 'ethers';

export interface QiVaultData {
    id?: number
    collateralRatio: number;
    collateralAmount: BigNumber;
    totalCollateralValue: BigNumber;
    maiDebt: BigNumber;
    owner: string;
    vault?: QiVault
    vaultId?: number
}
