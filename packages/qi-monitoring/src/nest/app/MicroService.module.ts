import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { CryptoPriceUpdateModule } from '../crypto-price-update';
import { BullModule } from "@nestjs/bull";
import { EventEmitterModule } from "@nestjs/event-emitter"
import { QiEventsListenerModule } from '../qi-events-listener/qi-events-listener.module';
import { DatabaseModule } from "../database";
import { QiReloadModule } from '../qi-reload/qi-reload.module';
import { ScheduleModule } from "@nestjs/schedule";
import { OracleWatcherModule } from "../oracle-watcher/oracle-watcher.module";
import { MicroServiceService } from "./MicroService.service";
import { MoneyEngineModule } from "@money-engine/common-nest";

@Module({
  imports: [LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }), 
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CryptoPriceUpdateModule,
    QiEventsListenerModule,
    QiReloadModule,
    DatabaseModule,
    OracleWatcherModule,
    MoneyEngineModule
  ],
  exports: [MicroServiceService],
  providers: [MicroServiceService]
})
export class MicroServiceModule {}
