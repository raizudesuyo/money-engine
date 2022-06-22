import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { RestApiModule, MicroServiceModule } from './nest/app';
import { dataSource } from './data-source';
import { reloadAll } from './reloadAll';
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

    const restApiPromise = app.listen(3000)

    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
      MicroServiceModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || 'amqp://localhost:5672']
        }
      }
    )

    const microservicePromise = microservice.listen();

    await Promise.all([restApiPromise, microservicePromise])
  }
}

export const syncAndListenToEvents = () => dataSource.initialize().then(async () => {
  reloadAll()
  Server.bootstrap()
})

export const listenToEvents = () => dataSource.initialize().then(async () => {
  Server.bootstrap()
})

export const syncOnly = () => dataSource.initialize().then(async () => {
  reloadAll()
});