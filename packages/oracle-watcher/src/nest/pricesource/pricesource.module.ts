import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { PricesourceService } from './pricesource.service';

@Module({
  providers: [PricesourceService],
  imports: [DatabaseModule],
  exports: [PricesourceService]
})
export class PricesourceModule {}
