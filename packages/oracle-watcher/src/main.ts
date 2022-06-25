import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./nest/app/app.module";
import { MONEY_ENGINE_QUEUE_NAME } from './nest/money-engine/money-engine.provider';


export class Server {
  static bootstrap = async () => {
    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || 'amqp://localhost:5672'],
          queue: MONEY_ENGINE_QUEUE_NAME,
        },
        bufferLogs: true,
        abortOnError: false,
      }
    )

    microservice.useLogger(microservice.get(Logger))
    await microservice.listen();
  }
}

Server.bootstrap();