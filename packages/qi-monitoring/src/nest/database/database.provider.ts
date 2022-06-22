import { dataSource } from '../../data-source'
import { QiVaultRepository, QiVaultDataRepository } from './repositories';

export const DATA_SOURCE = 'DATA_SOURCE';
export const QI_VAULT_REPOSITORY = 'ASSET_REPOSITORY';
export const QI_VAULT_DATA_REPOSITORY = 'ASSET_DELTA_ALERT_REPOSITORY';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => dataSource.initialize()
  },
  {
    provide: QI_VAULT_REPOSITORY,
    useFactory: QiVaultRepository,
    inject: [DATA_SOURCE],
  },
  {
    provide: QI_VAULT_DATA_REPOSITORY,
    useFactory: QiVaultDataRepository,
    inject: [DATA_SOURCE],
  },
];