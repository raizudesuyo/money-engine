import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { RestApiModule } from './nest/app/app.module';
import { createConnection } from 'typeorm';
import { reloadAll } from './reloadAll';
import { listen } from './qiEventsListener';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Server {
  static bootstrap = async () => {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      RestApiModule, 
      { 
        bufferLogs: true,
        transport: Transport.RMQ
      }
    );

    // const config = new DocumentBuilder()
    //   .setTitle('QiDAO Monitoring')
    //   .setDescription('money making engine 1.0')
    //   .setVersion('1.0')
    //   .build();

    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);  

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

createConnection().then(() => {
  Server.bootstrap()
})