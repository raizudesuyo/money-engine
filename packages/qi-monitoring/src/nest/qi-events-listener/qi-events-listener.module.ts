import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { QiEventsListenerService } from './qi-events-listener.service';

@Module({
  imports: [DatabaseModule],
  exports: [QiEventsListenerService],
  providers: [QiEventsListenerService]
})
export class QiEventsListenerModule {}
