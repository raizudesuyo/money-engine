import { MoneyEngineModule } from '@money-engine/common-nest';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { PricesourceService } from './pricesource.service';

@Module({
  providers: [PricesourceService],
  imports: [DatabaseModule, MoneyEngineModule],
  exports: [PricesourceService]
})
export class PricesourceModule {}
