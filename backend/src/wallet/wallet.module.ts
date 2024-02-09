import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { EthModule } from '../eth/eth.module';
import { DbmodelModule } from '../dbmodel/dbmodel.module';
import { WalletLiveService } from './ws-live.wallet.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EthModule, DbmodelModule, AuthModule],
  controllers: [WalletController],
  providers: [WalletService, WalletLiveService],
})
export class WalletModule {}
