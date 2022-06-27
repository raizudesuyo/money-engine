import { Module } from '@nestjs/common';
import { QiReloadService } from './qi-reload.service';
import { QiReloadConsumer } from './qi-reload.processor';
import { DatabaseModule } from '../database';
import { BullModule } from '@nestjs/bull';

@Module({
  providers: [QiReloadService],
  imports: [DatabaseModule, BullModule.registerQueue({
    name: 'qi-reload',
  })],
  exports: [QiReloadService]
})
export class QiReloadModule {}
