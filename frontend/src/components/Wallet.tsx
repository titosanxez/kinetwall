import React from 'react';
import '../App.css';
import { WalletProps } from '../controllers/wallet.controller';

export const Wallet: React.FC<WalletProps> = (props) => {
  return (
    <div className='wallet'>
      <div className='section'>
        <span>{props.address}</span>
      </div>
      <div>
        <span className='wallet-balance'>{props.balance} ETH</span>
      </div>
    </div>
  );
}