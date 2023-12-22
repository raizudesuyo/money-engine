import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AssetService } from '../asset';
import { PricesourceService } from '../pricesource';
import { ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY, PRICE_SOURCE_ORACLE_REPOSITORY, PRICE_SOURCE_POLL_JOB_REPOSITORY } from '../database';
import { getRepositoryToken } from '@nestjs/typeorm'
import { getLoggerToken } from 'nestjs-pino';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService, 
        AssetService,
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

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
