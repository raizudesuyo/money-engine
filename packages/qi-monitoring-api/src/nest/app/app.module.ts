import { Module } from '@nestjs/common';
import { VaultsController } from '../vaults/vaults.controller';
import { VaultsService } from '../vaults/vaults.service';
import { VaultDataController } from '../vault-data/vault-data.controller';
import { VaultDataService } from '../vault-data/vault-data.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [LoggerModule.forRoot()],
    controllers: [VaultsController, VaultDataController],
    providers: [VaultDataService, VaultsService],
  })
export class AppModule {}
