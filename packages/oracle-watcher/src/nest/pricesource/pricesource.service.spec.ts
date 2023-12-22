import { Test, TestingModule } from '@nestjs/testing';
import { PricesourceService } from './pricesource.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getLoggerToken } from 'nestjs-pino';
import { PRICE_SOURCE_POLL_JOB_REPOSITORY, PRICE_SOURCE_ORACLE_REPOSITORY, ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY } from '../database';

describe('PricesourceService', () => {
  let service: PricesourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesourceService,
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
          provide: getLoggerToken(PricesourceService.name),
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          }
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            deleteInterval: jest.fn(),
            addInterval: jest.fn(),
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<PricesourceService>(PricesourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
