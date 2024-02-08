import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbEntityUser } from './entities/user.dbmodel.entity';
import { DbServiceUsers } from './user.dbmodel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DbEntityUser,
    ]),
  ],
  providers: [
    DbServiceUsers,
  ],
  exports: [
    DbServiceUsers,
  ],
})
export class DbmodelModule {}
