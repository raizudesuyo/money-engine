import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { VaultsController } from './vaults.controller';
import { VaultsService } from './vaults.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VaultsController],
  providers: [VaultsService],
})
export class VaultsModule {}
