import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AssetService } from './asset.service';

@Module({
  providers: [AssetService],
  imports: [DatabaseModule],
  exports: [AssetService]
})
export class AssetModule {}
