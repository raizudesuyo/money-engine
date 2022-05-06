import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './nest/app/app.module';
import { createConnection } from 'typeorm';

export class Server {
  static bootstrap = async () => {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const config = new DocumentBuilder()
      .setTitle('QiDAO Monitoring Backend')
      .setDescription('money making engine 1.0')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useLogger(app.get(Logger));

    await app.listen(process.env.MONITORING_API_PORT || 7070)
  }
}

createConnection().then(() => {
  Server.bootstrap()
})