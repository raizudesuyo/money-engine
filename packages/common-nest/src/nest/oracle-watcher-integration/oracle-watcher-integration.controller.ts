import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { RegisterPricesourceRequest, CreateAssetRequest, CreateAssetResponse, RegisterPricesourceResponse } from "./dtos";
import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';
import { MONEY_ENGINE} from '../money-engine'

@Controller()
export abstract class OracleWatcherIntegrationController implements OnApplicationBootstrap {
  
  constructor(
    @Inject(MONEY_ENGINE) private client: ClientProxy,
  ) {}
  
  async onApplicationBootstrap() {
    // check if oracle watcher is initialized
    await this.client.connect();
    const observable = this.client.send<IsOracleWatcherInitializeResponse>('IS_ORACLE_WATCHER_INITIALIZED', {})
    observable.subscribe(async (response) => {
      if(response.isInitialized) {
        await this.registerAssetsToOracleWatcher();
        await this.registerPriceSourceToOracleWatcher();
      }
    })
  }

  @EventPattern(ORACLE_WATCHER_INITIALIZED)
  async oracleWatcherInitialized() {
    await this.registerAssetsToOracleWatcher();
    await this.registerPriceSourceToOracleWatcher();
  }

  abstract registerAssetsToOracleWatcher();
  abstract registerPriceSourceToOracleWatcher();
}

export interface IsOracleWatcherInitializeResponse {
  isInitialized: boolean
}