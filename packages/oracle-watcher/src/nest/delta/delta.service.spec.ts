import { Test, TestingModule } from '@nestjs/testing';
import { DeltaService } from './delta.service';

describe('DeltaService', () => {
  let service: DeltaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeltaService],
    }).compile();

    service = module.get<DeltaService>(DeltaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
