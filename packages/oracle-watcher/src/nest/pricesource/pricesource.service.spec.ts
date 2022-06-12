import { Test, TestingModule } from '@nestjs/testing';
import { PricesourceService } from './pricesource.service';

describe('PricesourceService', () => {
  let service: PricesourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricesourceService],
    }).compile();

    service = module.get<PricesourceService>(PricesourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
