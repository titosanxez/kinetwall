import React, { useEffect } from 'react';
import { Wallet } from './Wallet';
import { WalletController, WalletProps } from '../controllers/wallet.controller';
import { useAuth } from './Auth';
import { ConnectWallet } from './ConnectWallet';


export default function Dashboard() {
  let [wallets, setWallets] = React.useState<WalletProps[]>([])
  let auth = useAuth();

  useEffect(() => {
    if (!auth.user) {
      return;
    }
    WalletController.wallets(auth.user).then(
      (userWallets) => {
        console.log(JSON.stringify(userWallets));
        console.log(JSON.stringify(wallets));
        if (JSON.stringify(userWallets) !== JSON.stringify(wallets)) {
          setWallets(userWallets);
        }
      },
    );
  }, [auth.user, wallets]);

  return (
    <div className='dashboard'>
      <div className='wallet_list'>
        {
          wallets.map((walletProps, index) => (
            <Wallet key={index} {...walletProps} />
          ))
        }
      </div>
        <ConnectWallet onNewWallet={(newWallet) => {
          const updatedWallets = [...wallets]
          updatedWallets.push(newWallet);
          setWallets(updatedWallets);
        }}/>
    </div>
  );
}