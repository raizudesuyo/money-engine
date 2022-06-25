import { Reflector } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from '../database'
import { ScheduleModule } from '@nestjs/schedule';
import { AssetModule } from '../asset/asset.module';
import { PricesourceModule } from '../pricesource/pricesource.module';
import { DeltaModule } from '../delta/delta.module';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MoneyEngineModule } from '@money-engine/common-nest';
import { AppService } from './app.service';
@Module({
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
  imports: [
    AssetModule,
    PricesourceModule,
    DeltaModule,
    DatabaseModule,
    MoneyEngineModule,
    LoggerModule.forRoot(),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
