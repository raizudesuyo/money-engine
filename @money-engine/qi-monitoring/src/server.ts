import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { RestApiModule } from './nest/app/app.module';
import { dataSource } from './data-source';
import { reloadAll } from './reloadAll';
import { listen } from './qiEventsListener';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Server {
  static bootstrap = async () => {
    // Creates REST API end
    const app = await NestFactory.create(
      RestApiModule, 
      { 
        bufferLogs: true,
      }
    );

    const config = new DocumentBuilder()
      .setTitle('QiDAO Monitoring')
      .setDescription('Money Making Engine for QiDAO')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);  

    app.useLogger(app.get(Logger));

    await app.listen(3000)
  }
}

export const syncAndListenToEvents = () => dataSource.initialize().then(async () => {
  reloadAll()
  listen()
  Server.bootstrap()
})

export const listenToEvents = () => dataSource.initialize().then(async () => {
  listen()
  Server.bootstrap()
})

export const syncOnly = () => dataSource.initialize().then(async () => {
  reloadAll()
});