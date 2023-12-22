import { Test, TestingModule } from '@nestjs/testing';
import { DeltaService } from './delta.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { getLoggerToken } from 'nestjs-pino';
import { PRICE_SOURCE_POLL_JOB_REPOSITORY, PRICE_SOURCE_ORACLE_REPOSITORY, ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY, ASSET_DELTA_ALERT_REPOSITORY } from '../database';
import { PricesourceService } from '../pricesource';

describe('DeltaService', () => {
  let service: DeltaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeltaService,
        {
          provide: 'MONEY_ENGINE',
          useValue: {
            send: jest.fn(),
            connect: jest.fn(),
          }
        },
        {
          provide: PRICE_SOURCE_POLL_JOB_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: PRICE_SOURCE_ORACLE_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: ASSET_PRICE_DATA_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: ASSET_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: ASSET_DELTA_ALERT_REPOSITORY,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: getLoggerToken(DeltaService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          }
        },
      ],
    }).compile();

    service = module.get<DeltaService>(DeltaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
