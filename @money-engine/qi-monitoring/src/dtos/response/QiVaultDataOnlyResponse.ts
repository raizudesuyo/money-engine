import { QiVaultDataDTO } from '../QiVaultDataDTO';

export interface QiVaultDataOnlyResponse {
  vaultData: QiVaultDataDTO[],
  pageCount: number
}