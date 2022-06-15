import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { DatabaseModule } from '../database';
import { MoneyEngineModule } from '../money-engine/money-engine.module';
import { DeltaService } from './delta.service';

@Module({
  providers: [DeltaService],
  imports: [DatabaseModule, MoneyEngineModule],
  exports: [DeltaService]
})
export class DeltaModule {}
