import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TokensService } from './tokens.service';

import { ITokenResponse } from './interfaces/token-response.interface';
import { ITokenDataResponse } from './interfaces/token-data-response';
import { ITokenDestroyResponse } from './interfaces/token-destroy-response.interface';

@Controller()
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @MessagePattern('token_create')
  public async create(
    @Payload() data: { userId: number },
  ): Promise<ITokenResponse> {
    let result: ITokenResponse;
    if (data && data.userId) {
      try {
        const tokenResult = await this.tokensService.createToken(data.userId);
        result = {
          status: HttpStatus.CREATED,
          message: 'TOKEN_CREATE_SUCCESS',
          token: tokenResult.token,
        };
      } catch (e) {
        console.log(e);
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'TOKEN_CREATE_FAILED',
          token: null,
        };
      }
      return result;
    }
  }

  @MessagePattern('token_decode')
  public async decode(
    @Payload() data: { token: string },
  ): Promise<ITokenDataResponse> {
    const tokenData = await this.tokensService.decode(data.token);
    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData ? 'DECODE_SUCCESS' : 'DECODE_FAILED',
      data: tokenData,
    };
  }

  @MessagePattern('token_destroy')
  public async destroy(
    @Payload() data: { userId: number },
  ): Promise<ITokenDestroyResponse> {
    return {
      status: data && data.userId ? HttpStatus.OK : HttpStatus.BAD_GATEWAY,
      message:
        data && data.userId
          ? (await this.tokensService.destroyToken(data.userId)) &&
            'DESTROY_SUCCESS'
          : 'DESTROY_FAILED',
      error: null,
    };
  }
}
