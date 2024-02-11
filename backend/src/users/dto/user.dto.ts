import { IsEmail, IsJWT, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsOptional()
  @IsJWT()
  access_token?: string;
}
