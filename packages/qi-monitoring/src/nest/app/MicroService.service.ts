import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class MicroServiceService implements OnApplicationBootstrap {

  constructor() {}

  async onApplicationBootstrap() {
  }
}
