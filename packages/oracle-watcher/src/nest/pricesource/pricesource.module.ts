import { Module } from '@nestjs/common';
import { PricesourceService } from './pricesource.service';

@Module({
  providers: [PricesourceService]
})
export class PricesourceModule {}
