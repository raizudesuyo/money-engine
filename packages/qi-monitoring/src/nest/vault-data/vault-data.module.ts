import { Module } from '@nestjs/common';
import { VaultDataController } from './vault-data.controller';
import { VaultDataService } from './vault-data.service';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  controllers: [VaultDataController],
  providers: [VaultDataService],
})
export class VaultDataModule {}
