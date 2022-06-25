import { Module } from '@nestjs/common';
import { moneyEngineProvider } from './money-engine.provider';

@Module({
  providers: [moneyEngineProvider],
  exports: [moneyEngineProvider],
})
export class MoneyEngineModule {}