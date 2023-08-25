import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

import { IUser } from './interfaces/user.interface';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    @Inject('MAILER_SERVICE') private readonly mailerServiceClient: ClientProxy,
  ) {}

  public async register(userParams: IUser): Promise<IUser> {
    const userExist = await this.userRepository.findOne({
      where: { email: userParams.email },
    });
    if (userExist) throw new BadRequestException('Email đã được sử dụng.');
    userParams.password = await bcrypt.hash(userParams.password, 10);
    const user = this.userRepository.create(userParams);
    const newUser: IUser = await this.userRepository.save(user);
    return newUser;
  }

  public async login(loginRequest: {
    email: string;
    password: string;
  }): Promise<IUser> {
    const userExist: IUser = await this.userRepository.findOne({
      where: { email: loginRequest.email },
    });

    if (!userExist) throw new NotFoundException('Email không tồn tại.');
    const matchPassword = await bcrypt.compare(
      loginRequest.password,
      userExist.password,
    );
    if (!matchPassword) throw new BadRequestException('Sai mật khẩu.');
    return userExist;
  }

  public async getUserById(userId: number): Promise<IUser> {
    const user: IUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng.');
    return user;
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng.');
    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.SECRET_FORGOT_PASSWORD },
    );

    setTimeout(async () => {
      await firstValueFrom(
        this.mailerServiceClient.send('forgot_password', {
          email: user.email,
          subject: 'Email confirmation',
          text: `Mã xác nhận: ${token}`,
        }),
      );
    }, 3000);
    return 'Mã xác nhận sẽ được gửi vào email của bạn.';
  }

  public async resetPassword(token: string, password: string) {
    const userInfo = this.jwtService.verify(token, {
      secret: process.env.SECRET_FORGOT_PASSWORD,
    }) as { userId: number };

    const user = await this.userRepository.findOne({
      where: { id: userInfo.userId },
    });

    if (!user) throw new NotFoundException('Không tìm thấy người dùng.');
    const hashPwd = await bcrypt.hash(password, 10);
    user.password = hashPwd;
    return await this.userRepository.save(user);
  }
}
