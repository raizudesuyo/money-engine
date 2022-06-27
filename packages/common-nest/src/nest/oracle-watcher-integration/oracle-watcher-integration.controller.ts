import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';
import { Controller, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PinoLogger } from 'nestjs-pino';
import { finalize, retry } from 'rxjs';

@Controller()
export abstract class OracleWatcherIntegrationController implements OnApplicationBootstrap {
  
  constructor(
    private readonly __client: ClientProxy,
    private readonly __schedulerRegistry: SchedulerRegistry,
    private readonly __logger: PinoLogger
  ) {}
  
  async onApplicationBootstrap() {
    // check if oracle watcher is initialized\
    if (!await this.canStartRegister()) return;
    try {
      await this.__client.connect()
      const observable = this.__client.send<IsOracleWatcherInitializeResponse>('IS_ORACLE_WATCHER_INITIALIZED', {})
      observable
        .pipe(
          retry({ delay: 10000, count: 10000 }),
  
        )
        .subscribe({
          next: async (response) => {
            if(response.isInitialized) {
              this.__logger.info('Oracle Watcher Initialized via Queue')
              await this.registerAssetsToOracleWatcher();
              await this.registerPriceSourceToOracleWatcher();
            }
          },
          error: async (err) => {
            this.__logger.error(err)
          },
          complete: async () => {
            this.__logger.info('Complete')
          }
        })
    } 
    catch(err: any) { this.__logger.error(err); }
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