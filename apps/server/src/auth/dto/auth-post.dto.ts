import { IsEmail } from 'class-validator';

export class CreateTokenDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
