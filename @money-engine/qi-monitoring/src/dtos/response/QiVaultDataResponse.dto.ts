import { QiVault } from '../QiVault.dto';
import { QiVaultData } from '../QiVaultData.dto';

export class QiVaultDataResponse {
  vault: QiVault
  vaultData: QiVaultData[]
  pageCount: number
}