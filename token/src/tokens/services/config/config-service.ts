export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  constructor() {
    this.envConfig = {
      port: process.env.TOKEN_SERVICE_PORT,
      host: process.env.TOKEN_SERVICE_HOST,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
