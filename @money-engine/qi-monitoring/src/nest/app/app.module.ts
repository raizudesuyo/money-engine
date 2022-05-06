import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CryptoPriceUpdateController } from "../crypto-price-update/crypto-price-update.controller";
import { CryptoPriceUpdateService } from "../crypto-price-update/crypto-price-update.service";

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [CryptoPriceUpdateController],
  providers: [CryptoPriceUpdateService],
})
export class AppModule {}
