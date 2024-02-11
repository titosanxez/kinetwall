import React from 'react';
import { useAuth } from './Auth';
import { WalletController, WalletProps } from '../controllers/wallet.controller';

export interface ConnectWalletProps {
  onNewWallet: (wallet: WalletProps) => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  let auth = useAuth();

  async function handleSubmit(event: any) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const address: string = formData.get("address")!.toString();

    const newWallet = await WalletController.connect(auth.user!!, address);
    props.onNewWallet(newWallet);
  };


  return (
    <form onSubmit={handleSubmit}>
      <p>Connect Wallet</p>
      <div className='connect-wallet'>
        <label>
          <input type="text" name="address" />
        </label>
        <button type="submit">Connect</button>
      </div>
    </form>
  )
}