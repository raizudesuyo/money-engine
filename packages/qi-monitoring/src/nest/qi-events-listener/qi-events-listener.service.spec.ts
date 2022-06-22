import { Test, TestingModule } from '@nestjs/testing';
import { QiEventsListenerService } from './qi-events-listener.service';

describe('QiEventsListenerService', () => {
  let service: QiEventsListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QiEventsListenerService],
    }).compile();

    service = module.get<QiEventsListenerService>(QiEventsListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
