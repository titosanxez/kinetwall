import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum DbEntityWalletTokenType {
  ETH = 'ETH',
}


@Entity('wallets')
export class DbEntityWallet {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'uuid' })
  owner: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ name: 'token_type', type: 'enum', enum: DbEntityWalletTokenType })
  tokenType: string;
}
