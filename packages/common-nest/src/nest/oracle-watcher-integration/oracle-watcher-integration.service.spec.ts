import { Test, TestingModule } from '@nestjs/testing';
import { OracleWatcherIntegrationService } from './oracle-watcher-integration.service';

describe('OracleWatcherIntegrationService', () => {
  let service: OracleWatcherIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleWatcherIntegrationService],
    }).compile();

    service = module.get<OracleWatcherIntegrationService>(OracleWatcherIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
