import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CryptoPriceUpdateModule } from '../crypto-price-update';

@Module({
  imports: [LoggerModule.forRoot(), CryptoPriceUpdateModule],
})
export class MicroServiceModule {}
