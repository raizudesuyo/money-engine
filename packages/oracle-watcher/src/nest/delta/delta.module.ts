import { Module } from '@nestjs/common';
import { DeltaService } from './delta.service';

@Module({
  providers: [DeltaService]
})
export class DeltaModule {}
