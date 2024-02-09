import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletDto } from './dto/wallet.dto';
import { AddWalletDto } from './dto/add.wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getWallets(@Request() request): Promise<WalletDto[]> {
    return this.walletService.getWallets(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addWallet(
    @Body() addWalletDto: AddWalletDto,
    @Request() request,
  ): Promise<WalletDto> {
    return this.walletService.registerWallet(
      request.user.userId,
      addWalletDto.address,
    );
  }
}
