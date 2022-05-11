import { QiVault } from '../QiVault.dto';
import { QiVaultData } from '../QiVaultData.dto';

export interface QiVaultDataResponse {
  vault: QiVault,
  vaultData: QiVaultData[],
  pageCount: number
}