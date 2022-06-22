import { Test, TestingModule } from '@nestjs/testing';
import { OracleWatcherService } from './oracle-watcher.service';

describe('OracleWatcherService', () => {
  let service: OracleWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleWatcherService],
    }).compile();

    service = module.get<OracleWatcherService>(OracleWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
