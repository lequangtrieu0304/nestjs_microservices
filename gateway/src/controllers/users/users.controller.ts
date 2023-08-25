import {
  Body,
  Req,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Get,
  Param,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

import { Authorization } from 'src/decorator/authorization.decorator';
import { IAuthorizedRequest } from 'src/interfaces/request-authoried.interface';
import { IServiveTokenResponse } from 'src/interfaces/token/token-response';
import { ForgotPasswordDto } from 'src/interfaces/users/dto/forgot-password.dto';
import { LoginUserDto } from 'src/interfaces/users/dto/login-user.dto';
import { RegisterUserDto } from 'src/interfaces/users/dto/register-user.dto';
import { ResetPasswordDto } from 'src/interfaces/users/dto/reset-password.dto';
import { IServiceUserCreateResponse } from 'src/interfaces/users/service-user-create-response';
import { IServiceLoginResponse } from 'src/interfaces/users/service-user-login-response';
import { IUserForgotOrResetPwdResponse } from 'src/interfaces/users/user-forgot-password-response';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('TOKEN_SERVICE') private readonly tokenServiceClient: ClientProxy,
  ) {}

  @Post('register')
  public async register(@Body() userRequest: RegisterUserDto) {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send('register', userRequest),
    );
    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }
    return {
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
      },
      errors: null,
    };
  }

  @Post('login')
  public async login(@Body() loginRequest: LoginUserDto) {
    const getUserResponse: IServiceLoginResponse = await firstValueFrom(
      this.userServiceClient.send('login', loginRequest),
    );
    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const createTokenResponse: IServiveTokenResponse = await firstValueFrom(
      this.tokenServiceClient.send('token_create', {
        userId: getUserResponse.user.id,
      }),
    );

    return {
      message: createTokenResponse.message,
      token: createTokenResponse.token,
      errors: null,
    };
  }

  @Get('logout')
  @Authorization(true)
  public async logout(@Req() request: IAuthorizedRequest) {
    const userInfo = request.user;
    const destroyTokenResponse = await firstValueFrom(
      this.tokenServiceClient.send('token_destroy', {
        userId: userInfo.id,
      }),
    );
    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
        },
        destroyTokenResponse.status,
      );
    }

    return {
      message: destroyTokenResponse.status,
      errors: null,
      data: null,
    };
  }

  @Post('forgot-password')
  public async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IUserForgotOrResetPwdResponse> {
    const forgotPasswordResponse = await firstValueFrom(
      this.userServiceClient.send('forgot_password', {
        email: forgotPasswordDto.email,
      }),
    );
    return {
      status: forgotPasswordResponse.status,
      message: forgotPasswordResponse.message,
    };
  }

  @Post('reset-password/:token')
  public async resetPassword(
    @Param('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<IUserForgotOrResetPwdResponse> {
    const resetPasswordResponse = await firstValueFrom(
      this.userServiceClient.send('reset_password', {
        token,
        password: resetPassword.password,
      }),
    );
    return {
      status: resetPasswordResponse.status,
      message: resetPasswordResponse.message,
    };
  }
}
