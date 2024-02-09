import { IsHexadecimal } from 'class-validator';

export class AddWalletDto {
  @IsHexadecimal()
  address: string;
}
