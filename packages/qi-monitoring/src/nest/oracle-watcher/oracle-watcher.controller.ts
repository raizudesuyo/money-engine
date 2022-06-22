import { Controller, Inject } from '@nestjs/common';
import { MONEY_ENGINE, OracleWatcherIntegrationController } from '@money-engine/common-nest';
import { ClientProxy } from '@nestjs/microservices';
import { OracleWatcherService } from './oracle-watcher.service';

@Controller('oracle-watcher')
export class OracleWatcherController extends OracleWatcherIntegrationController {

  constructor(
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
    private readonly oracleWatcherService: OracleWatcherService,
  ) {
    super(client);
  }

  registerAssetsToOracleWatcher() {
    // Formulate assets
    this.oracleWatcherService.registerAssetsToOracleWatcher([])
    // Return Assets
  }
  registerPriceSourceToOracleWatcher() {
    this.oracleWatcherService.registerPriceSourceToOracleWatcher([]);
  }
}
