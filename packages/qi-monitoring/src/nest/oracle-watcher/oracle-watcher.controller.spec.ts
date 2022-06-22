import { Test, TestingModule } from '@nestjs/testing';
import { OracleWatcherController } from './oracle-watcher.controller';

describe('OracleWatcherController', () => {
  let controller: OracleWatcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OracleWatcherController],
    }).compile();

    controller = module.get<OracleWatcherController>(OracleWatcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
