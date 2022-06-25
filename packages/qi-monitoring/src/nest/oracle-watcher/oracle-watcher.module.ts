import { MoneyEngineModule } from '@money-engine/common-nest';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { OracleWatcherController } from './oracle-watcher.controller';
import { OracleWatcherService } from './oracle-watcher.service';

@Module({
  controllers: [OracleWatcherController],
  imports: [DatabaseModule, MoneyEngineModule],
  exports: [OracleWatcherService],
  providers: [OracleWatcherService]
})
export class OracleWatcherModule {}
