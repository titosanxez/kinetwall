import { Injectable } from '@nestjs/common';
import { Alchemy, BigNumber, Network } from 'alchemy-sdk';

const config = {
  apiKey: 'tSPFiNpDtQdsHcd5TMX_qp3iV--J2r_a', // Replace with your Alchemy API key.
  network: Network.ETH_SEPOLIA, // Replace with your network.
};

@Injectable()
export class EthService {
  private provider: Alchemy;
  constructor() {
    this.provider = new Alchemy(config);
  }

  async getBalance(address: string): Promise<BigNumber> {
    return await this.provider.core.getBalance(address);
  }
}
