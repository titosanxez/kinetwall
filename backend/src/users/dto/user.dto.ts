import { IsEmail, IsJWT, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsJWT()
  access_token?: string;
}
