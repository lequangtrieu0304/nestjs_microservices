import { BadRequestException, Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UsersService } from './users.service';
import { IUserCreateResponse } from './interfaces/user-create-response';
import { IUser } from './interfaces/user.interface';
import { IUserLoginResponse } from './interfaces/user-login-response';
import { IUserDataResponse } from './interfaces/user-data-response';
import { IUserPwdResponse } from './interfaces/user-forgotfwd-response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('register')
  public async register(
    @Payload() userParams: IUser,
  ): Promise<IUserCreateResponse> {
    let result: IUserCreateResponse;
    try {
      const user = await this.usersService.register(userParams);
      result = {
        status: HttpStatus.CREATED,
        message: 'REGISTER_SUCCESS',
        user: user,
        errors: null,
      };
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
        user: null,
        errors: e.errors,
      };
    }
    return result;
  }

  @MessagePattern('login')
  public async login(
    @Payload() loginData: { email: string; password: string },
  ) {
    let result: IUserLoginResponse;
    try {
      const user = await this.usersService.login(loginData);
      result = {
        status: HttpStatus.OK,
        message: 'LOGIN_SUCCESS',
        user: user,
      };
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
        user: null,
      };
    }
    return result;
  }

  @MessagePattern('user_get_by_id')
  public async getUserById(
    @Payload() userId: number,
  ): Promise<IUserDataResponse> {
    let result = null;
    try {
      const user = await this.usersService.getUserById(userId);
      result = {
        status: HttpStatus.OK,
        user,
      };
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        user: null,
      };
    }
    return result;
  }

  @MessagePattern('forgot_password')
  public async forgotPassword(
    @Payload() data: { email: string },
  ): Promise<IUserPwdResponse> {
    let result = null;
    try {
      const resultResponse = await this.usersService.forgotPassword(data.email);
      result = {
        status: HttpStatus.OK,
        message: resultResponse,
      };
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
      };
    }
    return result;
  }

  @MessagePattern('reset_password')
  public async resetPassword(
    @Payload() data: { token: string; password: string },
  ) {
    let result = null;
    try {
      const resultResponse = await this.usersService.resetPassword(
        data.token,
        data.password,
      );
      if (!resultResponse) throw new BadRequestException('RESET_FAILED');
      result = {
        status: HttpStatus.OK,
        message: 'RESET_SUCCESS',
      };
    } catch (e) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: e.message,
      };
    }
    return result;
  }
}
