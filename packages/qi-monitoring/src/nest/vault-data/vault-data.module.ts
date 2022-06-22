import { Module } from '@nestjs/common';
import { VaultDataController } from './vault-data.controller';
import { VaultDataService } from './vault-data.service';
import { DatabaseModule } from '../../../../oracle-watcher/src/nest/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VaultDataController],
  providers: [VaultDataService],
})
export class VaultDataModule {}
