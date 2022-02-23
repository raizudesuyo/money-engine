import { Module } from '@nestjs/common';
import { VaultsController } from './vaults.controller';
import { VaultsService } from './vaults.service';

@Module({
  imports: [],
  controllers: [VaultsController],
  providers: [VaultsService],
})
export class VaultsModule {}
