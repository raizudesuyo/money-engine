import { Module } from '@nestjs/common';
import { QiReloadService } from './qi-reload.service';
import { QiReloadConsumer } from './qi-reload.processor';
import { DatabaseModule } from '../database';

@Module({
  providers: [QiReloadService, QiReloadConsumer],
  imports: [DatabaseModule],
  exports: [QiReloadService, QiReloadConsumer]
})
export class QiReloadModule {}
