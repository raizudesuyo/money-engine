import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MONEY_ENGINE = 'MONEY_ENGINE';
export const MONEY_ENGINE_QUEUE_NAME = 'money-engine'
export const moneyEngineProvider = {
  provide: MONEY_ENGINE,
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    })
  }
}