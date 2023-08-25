import { MessagePattern, Payload } from '@nestjs/microservices';
import { ISendMail } from 'src/interfaces/send-mail.interface';
import { sendMail } from 'src/services/config/config-service';

export class MailerController {
  @MessagePattern('forgot_password')
  public async sendMail(@Payload() data: ISendMail) {
    try {
      sendMail(data);
      return 'OK';
    } catch (e) {
      return e.message;
    }
  }
}
