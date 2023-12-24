import { MoneyEngineModule } from '@money-engine/common-nest';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { PricesourceService } from './pricesource.service';
import { PricesourceController } from './pricesource.controller';

@Module({
  providers: [PricesourceService],
  imports: [DatabaseModule, MoneyEngineModule],
  exports: [PricesourceService],
  controllers: [PricesourceController]
})
export class PricesourceModule {}
