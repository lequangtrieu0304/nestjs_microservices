import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/shared/entities/token.entity';

import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), JwtModule],
  controllers: [TokensController],
  providers: [TokensService],
})
export class TokensModule {}
