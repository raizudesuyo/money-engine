import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "../database";
import { VaultDataModule } from '../vault-data';
import { VaultsModule } from '../vaults';

@Module({
  imports: [LoggerModule.forRoot(), VaultDataModule, VaultsModule, DatabaseModule],
})
export class RestApiModule {}
