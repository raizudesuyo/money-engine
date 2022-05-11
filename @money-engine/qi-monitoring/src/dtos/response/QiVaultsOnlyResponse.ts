import { QiVaultDTO } from '../QiVaultDTO';

export interface QiVaultsOnlyResponse {
  vaults: QiVaultDTO[],
  pageCount: number
}