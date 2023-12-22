import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetService } from '../asset';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { getLoggerToken } from 'nestjs-pino';
import { PRICE_SOURCE_POLL_JOB_REPOSITORY, PRICE_SOURCE_ORACLE_REPOSITORY, ASSET_PRICE_DATA_REPOSITORY, ASSET_REPOSITORY, ASSET_DELTA_ALERT_REPOSITORY } from '../database';
import { PricesourceService } from '../pricesource';
import { DeltaService } from '../delta';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        AssetService,
        PricesourceService,
        DeltaService,
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

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
