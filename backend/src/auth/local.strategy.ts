import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrLoginUserDto } from '../users/dto/create.users.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(
    request: CreateOrLoginUserDto,
    username: string,
    password: string,
  ): Promise<UserDto> {
    const user = await this.authService.validateUser(username, password, request);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}