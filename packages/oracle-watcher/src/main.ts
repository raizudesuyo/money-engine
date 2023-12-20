import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./nest/app/app.module";
import { MONEY_ENGINE_QUEUE_NAME } from "@money-engine/common-nest";

export class Server {
  static bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    const microservice = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
      },
      bufferLogs: true,
      abortOnError: false,
    })

    microservice.useLogger(microservice.get(Logger))
    
    await app.startAllMicroservices()
    await app.listen(7070)
  }
}

Server.bootstrap();