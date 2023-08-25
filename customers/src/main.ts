import { NestFactory } from '@nestjs/core';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

import { ConfigService } from './services/config/config-service';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();
const configService = new ConfigService();

async function bootstrap() {
  config();
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: configService.get('host'),
      port: configService.get('port'),
    },
  } as TcpOptions);

  await app.listen();
  logger.log('----------------------------------');
  logger.log('Microservice Customer is listening');
}
bootstrap();
