import React, { useEffect } from 'react';
import { Wallet } from './Wallet';
import {
  WalletController,
  WalletProps,
} from '../controllers/wallet.controller';
import { useAuth } from './Auth';
import { ConnectWallet } from './ConnectWallet';
import useWebSocket from "react-use-websocket"

export default function Dashboard() {
  let [wallets, setWallets] = React.useState<WalletProps[]>([])
  let auth = useAuth();
  const WS_URL = `ws://${process.env.REACT_APP_KINETWALL_WEB_HOST_URL}:3000`
  const { lastMessage } = useWebSocket(
    WS_URL,
    {
      fromSocketIO: true,
      share: false,
      shouldReconnect: () => true,
      protocols: [`${auth.user?.access_token}`],
    },
  )

  useEffect(() => {
    if (!auth.user) {
      return;
    }
    WalletController.wallets(auth.user).then(
      (userWallets) => {
        if (JSON.stringify(userWallets) !== JSON.stringify(wallets)) {
          setWallets(userWallets);
        }
      },
    );
  }, [auth.user, wallets]);

  // Live updates
  useEffect(() => {
    if (lastMessage?.type === 'message') {
      const eventPayload = JSON.parse(lastMessage.data.match(/\[.*]/));
      if (Array.isArray(eventPayload) && Array.isArray(eventPayload[1])) {
        setWallets(eventPayload[1])
      }
    }
  }, [lastMessage]);

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