import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [DatabaseModule],
  exports: [AssetService]
})
export class AssetModule {}
