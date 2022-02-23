import { Test, TestingModule } from '@nestjs/testing';
import { VaultDataService } from './vault-data.service';

describe('VaultDataService', () => {
  let service: VaultDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VaultDataService],
    }).compile();

    service = module.get<VaultDataService>(VaultDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
