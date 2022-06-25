import { ORACLE_WATCHER_PRICE_UPDATED, UpdatePriceEvent2 } from '@money-engine/common';
import { MONEY_ENGINE, OracleWatcherIntegrationController } from '@money-engine/common-nest';
import { Controller, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ALL_VAULT_DATA_SYNCED } from '../../constants/events';
import { GLOBAL_STATE_REPOSITORY, TGlobalStateRepository } from '../database';
import { OracleWatcherService } from './oracle-watcher.service';

@Controller('oracle-watcher')
export class OracleWatcherController extends OracleWatcherIntegrationController {
  
  constructor(
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
    @InjectPinoLogger(OracleWatcherController.name) private readonly logger: PinoLogger,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly oracleWatcherService: OracleWatcherService,
    @Inject(GLOBAL_STATE_REPOSITORY) private readonly globalStateRepository: TGlobalStateRepository,

  ) {
    super(client, schedulerRegistry, logger);
  }

  async registerAssetsToOracleWatcher() {
    await this.oracleWatcherService.registerAssets()
  }
  async registerPriceSourceToOracleWatcher() {
    await this.oracleWatcherService.registerPriceSources();
  }

  async canStartRegister(): Promise<boolean> {
    return await this.oracleWatcherService.canStartRegister();
  }

  @OnEvent(ALL_VAULT_DATA_SYNCED)
  async onAllVaultDataSynced() {
    await this.oracleWatcherService.onAllVaultDataSynced();
  }

  @EventPattern(ORACLE_WATCHER_PRICE_UPDATED)
  async onOracleWatcherPriceUpdated(payload: UpdatePriceEvent2) {
    await this.oracleWatcherService.onOracleWatcherPriceUpdated(payload);
  }
}
