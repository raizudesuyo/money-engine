import { dataSource } from '../../data-source'
import { QiVaultRepository, QiVaultDataRepository } from './repositories';

export const DATA_SOURCE = 'DATA_SOURCE';
export const QI_VAULT_REPOSITORY = 'QI_VAULT_REPOSITORY';
export const QI_VAULT_DATA_REPOSITORY = 'QI_VAULT_DATA_REPOSITORY';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => dataSource.isInitialized ? dataSource : dataSource.initialize()
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