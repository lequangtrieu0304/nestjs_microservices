import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TcpOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

import { Logger } from '@nestjs/common';
import { ConfigService } from './tokens/services/config/config-service';

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
  logger.log('Microservice Token is listening');
}
bootstrap();
