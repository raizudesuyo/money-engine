import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { VaultDataModule } from '../vault-data';
import { VaultsModule } from '../vaults';

@Module({
  imports: [LoggerModule.forRoot(), VaultDataModule, VaultsModule],
})
export class RestApiModule {}
