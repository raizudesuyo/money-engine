import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CryptoPriceUpdateController } from './crypto-price-update.controller';
import { CryptoPriceUpdateService } from './crypto-price-update.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CryptoPriceUpdateController],
  providers: [CryptoPriceUpdateService],
})
export class CryptoPriceUpdateModule {}
