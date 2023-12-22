import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MONEY_ENGINE = 'MONEY_ENGINE';
export const MONEY_ENGINE_QUEUE_NAME = 'money-engine'
export const moneyEngineProvider = {
  provide: MONEY_ENGINE,
  useFactory: () => {
    return ClientProxyFactory.create({
      // transport: Transport.REDIS,
      // transport?: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
    })
  }
}