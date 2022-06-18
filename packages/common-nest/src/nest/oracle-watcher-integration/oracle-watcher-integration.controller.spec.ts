import { Test, TestingModule } from '@nestjs/testing';
import { OracleWatcherIntegrationController } from './oracle-watcher-integration.controller';

describe('OracleWatcherIntegrationController', () => {
  let controller: OracleWatcherIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OracleWatcherIntegrationController],
    }).compile();

    controller = module.get<OracleWatcherIntegrationController>(OracleWatcherIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
