import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../users/dto/user.dto';
import { DbServiceUsers } from '../dbmodel/user.dbmodel.service';
import { jwtConstants } from './auth.constants';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private dbUsers: DbServiceUsers,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    request: any,
  ): Promise<UserDto> {
    const dbUser = await this.dbUsers.find(username);
    if (!dbUser) {
      // Check for required information
      if (!request.body.email) {
        throw new Error('Email is required');
      }

      // Create a new user
      const newUserPasswordHash = await bcrypt.hash(
        `${username}@${password}`,
        SALT_OR_ROUNDS,
      );
      const { passwordHash, ...newUser } = await this.dbUsers.create({
        username: username,
        passwordHash: new Buffer(newUserPasswordHash),
        email: request.body.email,
      });

      return newUser;
    }

    if (
      await bcrypt.compare(
        `${username}@${password}`,
        dbUser.passwordHash.toString(),
      )
    ) {
      const { passwordHash, ...existingUser } = dbUser;
      return existingUser;
    }
    return null;
  }

  setJwt(forUser: UserDto): UserDto {
    const payload = { username: forUser.username, sub: forUser.userId };
    return {
      ...forUser,
      access_token: this.jwtService.sign(payload),
    };
  }

  public getUserFromAuthenticationToken(
    token: string,
  ): Promise<UserDto | undefined> {
    const payload = this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    if (payload.sub) {
      return this.findUser(payload.sub);
    }
  }

  async findUser(userId: string): Promise<UserDto> {
    const { passwordHash, ...user } = await this.dbUsers.getById(userId);
    return user;
  }
}
