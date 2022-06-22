import { Test, TestingModule } from '@nestjs/testing';
import { QiReloadService } from './qi-reload.service';

describe('QiReloadService', () => {
  let service: QiReloadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QiReloadService],
    }).compile();

    service = module.get<QiReloadService>(QiReloadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
