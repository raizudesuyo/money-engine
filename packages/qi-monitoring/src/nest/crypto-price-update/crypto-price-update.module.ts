import { Module } from '@nestjs/common';
import { CryptoPriceUpdateController } from './crypto-price-update.controller';
import { CryptoPriceUpdateService } from './crypto-price-update.service';

@Module({
  imports: [],
  controllers: [CryptoPriceUpdateController],
  providers: [CryptoPriceUpdateService],
})
export class CryptoPriceUpdateModule {}
