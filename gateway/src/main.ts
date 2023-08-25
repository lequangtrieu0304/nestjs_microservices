import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './services/config/config-service';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apidoc', app, document);

  app.setGlobalPrefix('api/v1');

  const PORT = new ConfigService().get('port');
  await app.listen(PORT);

  logger.log('-----------------------------------');
  logger.log('Server time: ' + new Date().toString());
  logger.log(`Running app on: ${PORT}`);
  logger.log(`Running app doc api on: http://localhost:${PORT}/apidoc`);
}
bootstrap();
