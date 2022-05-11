import { QiVaultDTO } from '../QiVaultDTO';
import { QiVaultDataDTO } from '../QiVaultDataDTO';

export interface QiVaultDataResponse {
  vault: QiVaultDTO,
  vaultData: QiVaultDataDTO[],
  pageCount: number
}