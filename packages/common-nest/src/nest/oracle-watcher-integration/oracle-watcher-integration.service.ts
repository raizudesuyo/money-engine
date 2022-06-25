import { firstValueFrom } from 'rxjs'
import { Injectable } from '@nestjs/common';
import { CreateAssetResponse } from './dtos/CreateAssetResponse.dto';
import { CreateAssetRequest } from './dtos/CreateAssetRequest.dto';
import { RegisterPricesourceResponse } from './dtos/RegisterPricesourceResponse.dto';
import { RegisterPricesourceRequest } from './dtos/RegisterPricesourceRequest.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORACLE_WATCHER_REGISTER_ASSET, ORACLE_WATCHER_REGISTER_PRICE_SOURCE } from '@money-engine/common';

@Injectable()
export abstract class OracleWatcherIntegrationService {

  constructor(
    private readonly __client: ClientProxy,
  ) {}

  async registerAssetsToOracleWatcher(assets: CreateAssetRequest[]): Promise<CreateAssetResponse[]> {
    const createAssetObservable = this.__client.send<CreateAssetResponse[]>(ORACLE_WATCHER_REGISTER_ASSET, assets)
    return await firstValueFrom<CreateAssetResponse[]>(createAssetObservable);
    
  }


  async registerPriceSourceToOracleWatcher(priceSources: RegisterPricesourceRequest[]): Promise<RegisterPricesourceResponse[]> {
    const registerPriceSourceObservable = this.__client.send<RegisterPricesourceResponse[]>(ORACLE_WATCHER_REGISTER_PRICE_SOURCE, priceSources)
    return await firstValueFrom<RegisterPricesourceResponse[]>(registerPriceSourceObservable);
  };
}
