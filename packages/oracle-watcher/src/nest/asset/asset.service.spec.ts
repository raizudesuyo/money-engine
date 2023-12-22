import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { ASSET_REPOSITORY } from '../database';

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: ASSET_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
