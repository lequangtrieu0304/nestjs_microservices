import { Module } from '@nestjs/common';
import { MailerController } from './controllers/mailer.controller';

@Module({
  controllers: [MailerController],
})
export class AppModule {}
