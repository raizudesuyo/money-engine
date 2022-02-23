import { Test, TestingModule } from '@nestjs/testing';
import { VaultDataController } from './vault-data.controller';

describe('VaultDataController', () => {
  let controller: VaultDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VaultDataController],
    }).compile();

    controller = module.get<VaultDataController>(VaultDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
