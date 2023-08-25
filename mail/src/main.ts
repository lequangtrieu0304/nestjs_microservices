import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger } from '@nestjs/common';
import { ConfigService } from './services/config/config-service';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { config } from 'dotenv';

const logger = new Logger();

async function bootstrap() {
  config();
  const configService = new ConfigService();
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: configService.get('host'),
      port: configService.get('port'),
    },
  } as TcpOptions);

  await app.listen();
  logger.log('----------------------------------');
  logger.log('Microservice Mailer is listening');
}
bootstrap();
