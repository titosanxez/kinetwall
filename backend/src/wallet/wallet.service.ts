import { Injectable } from '@nestjs/common';
import { WalletDto } from './dto/wallet.dto';
import { EthService } from '../eth/eth.service';
import { DbServiceWallets } from '../dbmodel/wallet.dbmodel.service';
import { ethers } from 'ethers';
import {
  DbEntityWallet,
  DbEntityWalletTokenType,
} from '../dbmodel/entities/wallet.dbmodel.entity';
import { W } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    private dbWallets: DbServiceWallets,
    private ethService: EthService,
  ) {}

  async getWallets(userId: string): Promise<WalletDto[]> {
    const dbWallets = await this.dbWallets.findAll(userId);
    const enrichedWallets = [];
    for (const dbWallet of dbWallets) {
      enrichedWallets.push(await this.enrichWalletDetails(dbWallet));
    }

    return enrichedWallets;
  }

  async registerWallet(userId: string, address: string) {
    // Determine if the provided address is valid
    if (!ethers.isAddress(address)) {
      throw new Error(
        `Specified address=${address} is not a valid ETH address`,
      );
    }

    // Attempt to add the specified address, and fail if it already exists
    const dbWallet = await this.dbWallets.create({
      address: address,
      owner: userId,
      tokenType: DbEntityWalletTokenType.ETH.toString(),
    });

    return this.enrichWalletDetails(dbWallet);
  }

  private async enrichWalletDetails(
    dbWallet: DbEntityWallet,
  ): Promise<WalletDto> {
    const balance = await this.ethService.getBalance(dbWallet.address);
    return {
      id: dbWallet.id,
      address: dbWallet.address,
      owner: dbWallet.owner,
      balance: ethers.formatEther(balance.toString()),
    };
  }
}
