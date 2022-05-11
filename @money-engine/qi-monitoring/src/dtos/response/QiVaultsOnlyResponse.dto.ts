import { QiVault } from '../QiVault.dto';

export interface QiVaultsOnlyResponse {
  vaults: QiVault[],
  pageCount: number
}