import { Module } from '@nestjs/common';

import { ClientProxyFactory } from '@nestjs/microservices';

import { ConfigService } from './services/config/config-service';

import { UserController } from './controllers/users/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './services/guard/authorization.guard';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('tokenService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
