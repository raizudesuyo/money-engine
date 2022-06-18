import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { providers } from 'ethers';
import { moneyEngineProvider } from './money-engine.provider';

@Module({
  providers: [moneyEngineProvider],
  exports: [moneyEngineProvider],
})
export class MoneyEngineModule {}