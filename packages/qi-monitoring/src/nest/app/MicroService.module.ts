import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CryptoPriceUpdateModule } from '../crypto-price-update';
import { BullModule } from "@nestjs/bull";
import { EventEmitterModule } from "@nestjs/event-emitter"
import { QiEventsListenerModule } from '../qi-events-listener/qi-events-listener.module';
import { DatabaseModule } from "../database";
import { QiReloadModule } from '../qi-reload/qi-reload.module';

@Module({
  imports: [LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }), 
    CryptoPriceUpdateModule,
    QiEventsListenerModule,
    QiReloadModule,
    DatabaseModule
  ],
})
export class MicroServiceModule {}
