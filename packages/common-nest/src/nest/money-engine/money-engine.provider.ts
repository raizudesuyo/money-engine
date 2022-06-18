import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const MONEY_ENGINE = 'MONEY_ENGINE';
export const MONEY_ENGINE_QUEUE_NAME = 'money-engine'
export const moneyEngineProvider = {
  provide: MONEY_ENGINE,
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: MONEY_ENGINE_QUEUE_NAME
      },
    })
  }
}