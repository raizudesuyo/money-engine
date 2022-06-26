import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { RegisterPricesourceRequest, CreateAssetRequest, CreateAssetResponse, RegisterPricesourceResponse } from "./dtos";
import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';
import { MONEY_ENGINE} from '../money-engine'
import { SchedulerRegistry } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export abstract class OracleWatcherIntegrationController implements OnApplicationBootstrap {
  
  constructor(
    private readonly __client: ClientProxy,
    private readonly __schedulerRegistry: SchedulerRegistry,
    private readonly __logger: PinoLogger
  ) {}
  
  async onApplicationBootstrap() {
    // check if oracle watcher is initialized
    this.__schedulerRegistry.addInterval('poll-oracle-watcher', setInterval(async () => {
      if (!await this.canStartRegister()) return;
      await this.__client.connect();
      const observable = this.__client.send<IsOracleWatcherInitializeResponse>('IS_ORACLE_WATCHER_INITIALIZED', {})
      observable.subscribe({
        async next(response) {
          if(response.isInitialized) {
            this.__logger.info('Oracle Watcher Initialized via Queue')
            await this.registerAssetsToOracleWatcher();
            await this.registerPriceSourceToOracleWatcher();
            this.__schedulerRegistry.deleteInterval('poll-oracle-watcher') 
          }
        },
        async error(err) {
          this.__logger.err(err)
        }
      })
    }, 10000))
  }

  @EventPattern(ORACLE_WATCHER_INITIALIZED)
  async oracleWatcherInitialized() {
    if (!await this.canStartRegister()) return; 
    this.__logger.info('Oracle Watcher Initialized via Event')
    await this.registerAssetsToOracleWatcher();
    await this.registerPriceSourceToOracleWatcher();
  }

  abstract registerAssetsToOracleWatcher();
  abstract registerPriceSourceToOracleWatcher();
  abstract canStartRegister(): Promise<boolean>
}

export interface IsOracleWatcherInitializeResponse {
  isInitialized: boolean
}