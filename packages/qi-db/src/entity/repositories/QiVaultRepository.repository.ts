import { EntityRepository, Repository } from "typeorm";
import { QiVault } from '../QiVault.entity';

@EntityRepository(QiVault)
export class QiVaultRepository extends Repository<QiVault> {

}
