import { IsNumber, IsString } from 'class-validator';

export class WalletDto {
  @IsString()
  id: string;

  @IsString()
  owner: string;

  @IsString()
  address: string;

  @IsNumber()
  balance: string;
}
