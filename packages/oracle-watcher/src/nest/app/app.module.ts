import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseModule } from '../database'
import { ScheduleModule } from '@nestjs/schedule';
import { AssetModule } from '../asset/asset.module';
import { PricesourceModule } from '../pricesource/pricesource.module';
import { DeltaModule } from '../delta/delta.module';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ScheduleModule.forRoot(),
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    AssetModule,
    PricesourceModule,
    DeltaModule,
    DatabaseModule,
    
  ],
})
export class AppModule {}
