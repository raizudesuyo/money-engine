import { QiVaultData } from '../QiVaultData.dto';

export interface QiVaultDataOnlyResponse {
  vaultData: QiVaultData[],
  pageCount: number
}