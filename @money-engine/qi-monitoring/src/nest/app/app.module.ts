import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CryptoPriceUpdateController } from "../crypto-price-update/crypto-price-update.controller";
import { CryptoPriceUpdateService } from "../crypto-price-update/crypto-price-update.service";
import { VaultDataController, VaultDataService } from '../vault-data/';

@Module({
  imports: [LoggerModule.forRoot()],
  controllers: [VaultDataController],
  providers: [VaultDataService],
})
export class RestApiModule {}
