import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbEntityUser } from './entities/user.dbmodel.entity';
import { DbServiceUsers } from './user.dbmodel.service';
import { DbServiceWallets } from './wallet.dbmodel.service';
import { DbEntityWallet } from './entities/wallet.dbmodel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DbEntityUser, DbEntityWallet])],
  providers: [DbServiceUsers, DbServiceWallets],
  exports: [DbServiceUsers, DbServiceWallets],
})
export class DbmodelModule {}
