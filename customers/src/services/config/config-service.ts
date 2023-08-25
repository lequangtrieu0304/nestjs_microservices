import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  constructor() {
    this.envConfig = {
      host: process.env.USER_SERVICE_HOST,
      port: process.env.USER_SERVICE_PORT,
    };

    this.envConfig.mailerService = {
      options: {
        port: process.env.MAIL_SERVICE_PORT,
        host: process.env.MAIL_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
