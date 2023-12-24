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
        {
          provide: 'MONEY_ENGINE',
          useValue: {
            send: jest.fn(),
            connect: jest.fn(),
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
