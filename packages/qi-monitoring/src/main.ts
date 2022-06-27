import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { Logger,  } from 'nestjs-pino';
import { RestApiModule, MicroServiceModule } from './nest/app';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { program } from 'commander'
import { MONEY_ENGINE_QUEUE_NAME } from "@money-engine/common-nest";


export class Server {
  static bootstrap = async () => {
    // Creates REST API end
    // const app = await NestFactory.create(
    //   RestApiModule, 
    //   { 
    //     bufferLogs: true,
    //   }
    // );

    // const config = new DocumentBuilder()
    //   .setTitle('QiDAO Monitoring')
    //   .setDescription('Money Making Engine for QiDAO')
    //   .setVersion('1.0')
    //   .build();

    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);  

    // app.useLogger(app.get(Logger));

    // const restApiPromise = app.listen(3000)

    const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
      MicroServiceModule,
      {
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      }
    )
    microservice.useLogger(microservice.get(Logger));
    microservice.enableShutdownHooks();

    await microservice.listen();

    // await Promise.all([restApiPromise, microservicePromise])
  }
}

Server.bootstrap();

program
  .option('-s, --sync', 'Generate sync commands')
  .option('-l, --listen', 'listens', true)
  .action(() => {

  })