import { DataSource } from 'typeorm';
import { dataSource } from '../../data-source'
import { Asset, AssetDeltaAlert, AssetPriceData, AssetPriceSource, AssetPriceSourcePollJob } from '../../entity';

export const DATA_SOURCE = 'DATA_SOURCE';
export const ASSET_REPOSITORY = 'ASSET_REPOSITORY';
export const ASSET_DELTA_ALERT_REPOSITORY = 'ASSET_DELTA_ALERT_REPOSITORY';
export const ASSET_PRICE_DATA_REPOSITORY = 'ASSET_PRICE_DATA_REPOSITORY';
export const PRICE_SOURCE_ORACLE_REPOSITORY = 'PRICE_SOURCE_ORACLE_REPOSITORY';
export const PRICE_SOURCE_POLL_JOB_REPOSITORY = 'PRICE_SOURCE_POLL_JOB_REPOSITORY';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => dataSource.initialize()
  },
  {
    provide: ASSET_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Asset),
    inject: [DATA_SOURCE],
  },
  {
    provide: ASSET_DELTA_ALERT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetDeltaAlert),
    inject: [DATA_SOURCE],
  },
  {
    provide: ASSET_PRICE_DATA_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetPriceData),
    inject: [DATA_SOURCE],
  },
  {
    provide: PRICE_SOURCE_ORACLE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetPriceSource),
    inject: [DATA_SOURCE],
  },
  {
    provide: PRICE_SOURCE_POLL_JOB_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetPriceSourcePollJob),
    inject: [DATA_SOURCE],
  },
];