import { Module } from '@nestjs/common';
import { MONEY_ENGINE, moneyEngineProvider } from './money-engine.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  // providers: [moneyEngineProvider],
  exports: [moneyEngineProvider],
  imports: [
    ClientsModule.register([
      {
        name: MONEY_ENGINE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT)
        }
      }
    ])
  ]
})
export class MoneyEngineModule {}