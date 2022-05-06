import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './nest/app/app.module';
import { createConnection } from 'typeorm';
import { reloadAll } from './reloadAll';
import { listen } from './qiEventsListener';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

export class Server {
  static bootstrap = async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule, 
      { 
        bufferLogs: true,
        transport: Transport.RMQ
      }
    );

    app.useLogger(app.get(Logger));

    await app.listen()
  }
}

export const syncAndListenToEvents = () => createConnection().then(async () => {
  reloadAll()
  listen()
  Server.bootstrap()
})

export const listenToEvents = () => createConnection().then(async () => {
  listen()
  Server.bootstrap()
})


export const syncOnly = () => createConnection().then(async () => {
  reloadAll()
});