import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DbEntityUser } from './entities/user.dbmodel.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DbServiceUsers {
  constructor(
    @InjectRepository(DbEntityUser)
    private userRepository: Repository<DbEntityUser>,
  ) {}

  find(username: string): Promise<DbEntityUser> {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  create(entity: Omit<DbEntityUser, 'userId'>): Promise<DbEntityUser> {
    return this.userRepository.save(entity);
  }
}
