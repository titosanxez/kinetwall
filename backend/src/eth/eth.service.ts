import { Injectable } from '@nestjs/common';
import { Alchemy, BigNumber, Network } from 'alchemy-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthService {
  private provider: Alchemy;
  constructor(private configService: ConfigService) {
    this.provider = new Alchemy({
      apiKey: this.configService.get<string>('ETH_PROVIDER_APIKEY'),
      network: Network.ETH_SEPOLIA,
    });
  }

  async getBalance(address: string): Promise<BigNumber> {
    return await this.provider.core.getBalance(address);
  }
}
