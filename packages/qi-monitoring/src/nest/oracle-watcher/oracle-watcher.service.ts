import { Inject, Injectable } from '@nestjs/common';
import { MONEY_ENGINE, OracleWatcherIntegrationService } from '@money-engine/common-nest';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OracleWatcherService extends OracleWatcherIntegrationService {
  constructor(
    @Inject(MONEY_ENGINE) private readonly client: ClientProxy,
  ) {
    super(client);
  }
}
