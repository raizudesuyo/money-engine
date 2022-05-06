import { EntityRepository, Repository } from "typeorm";
import { QiVaultData } from '../QiVaultData.entity';

@EntityRepository(QiVaultData)
export class QiVaultDataRepository extends Repository<QiVaultData> {

}
