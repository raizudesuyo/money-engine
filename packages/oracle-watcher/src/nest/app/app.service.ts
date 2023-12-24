import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MONEY_ENGINE } from '@money-engine/common-nest';
import { ORACLE_WATCHER_INITIALIZED } from '@money-engine/common';
@Injectable()
export class AppService implements OnApplicationBootstrap {

  constructor(
    @Inject(MONEY_ENGINE) private client: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
    this.client.emit(ORACLE_WATCHER_INITIALIZED, {})
  }
}
