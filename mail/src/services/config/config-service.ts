export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  constructor() {
    this.envConfig = {
      host: process.env.MAIL_SERVICE_HOST,
      port: process.env.MAIL_SERVICE_PORT,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

import * as nodemailer from 'nodemailer';
import { ISendMail } from 'src/interfaces/send-mail.interface';
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export const sendMail = async (options: ISendMail) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions: MailOptions = {
    from: 'trieulequang@ptit.edu.vn<support>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
