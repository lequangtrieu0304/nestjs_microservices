import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto extends LoginUserDto {
  @ApiProperty({
    example: 'quangtrieu123',
  })
  name: string;
}
