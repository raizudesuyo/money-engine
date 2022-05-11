import { Module } from '@nestjs/common';
import { VaultDataController } from './vault-data.controller';
import { VaultDataService } from './vault-data.service';

@Module({
  imports: [],
  controllers: [VaultDataController],
  providers: [VaultDataService],
})
export class VaultDataModule {}
