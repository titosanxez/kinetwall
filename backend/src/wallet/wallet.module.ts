import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { EthModule } from '../eth/eth.module';
import { DbmodelModule } from '../dbmodel/dbmodel.module';

@Module({
  imports: [EthModule, DbmodelModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
