import { EntityRepository, Repository } from "typeorm";
import { QiVault } from '../QiVault.entity';
import { QiVaultData } from '../QiVaultData.entity';

@EntityRepository(QiVaultData)
export class QiVaultDataRepository extends Repository<QiVaultData> {

}
