import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email can not be empty.' })
  @IsEmail({}, { message: 'Please provide a valid email.' })
  email: string;
}
