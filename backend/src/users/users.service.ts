import { Injectable } from '@nestjs/common';
import { DbServiceUsers } from '../dbmodel/user.dbmodel.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private dbUsers: DbServiceUsers) {}

  async find(username: string): Promise<UserDto | undefined> {
    const { passwordHash, ...user } = await this.dbUsers.find(username);
    return user;
  }
}
