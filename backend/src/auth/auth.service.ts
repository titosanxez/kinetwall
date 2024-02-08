import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateOrLoginUserDto } from '../users/dto/create.users.dto';
import { UserDto } from '../users/dto/user.dto';
import { DbServiceUsers } from '../dbmodel/user.dbmodel.service';

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
    const payload = { username: forUser.username, sub: forUser.id };
    return {
      ...forUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
