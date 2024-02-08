import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbmodelModule } from '../dbmodel/dbmodel.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DbmodelModule, AuthModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
