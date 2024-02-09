import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DbEntityWallet } from './entities/wallet.dbmodel.entity';

@Injectable()
export class DbServiceWallets {
  constructor(
    @InjectRepository(DbEntityWallet)
    private walletRepository: Repository<DbEntityWallet>,
  ) {}

  find(address: string): Promise<DbEntityWallet | undefined> {
    return this.walletRepository.findOne({
      where: {
        address: address,
      },
    });
  }

  findAll(userId: string): Promise<DbEntityWallet[]> {
    return this.walletRepository.find({
      where: {
        owner: userId,
      },
    });
  }

  create(entity: Omit<DbEntityWallet, 'id'>): Promise<DbEntityWallet> {
    return this.walletRepository.save(entity);
  }
}
