/**
 * This represents some generic auth provider API, like Firebase.
 */

export type LoggedUserType = {
  id: string;
  username: string;
  email: string;
  access_token: string;
}

export type LoginCredentials = {
  username: string;
  password: string;
}

export interface WalletProps {
  address: string
  balance: string
}

const WALLET_WEB_URL = `http://${process.env.REACT_APP_KINETWALL_WEB_HOST_URL}`;

const WalletController = {
  async login(credentials: LoginCredentials): Promise<LoggedUserType> {
    const response = await fetch(`${WALLET_WEB_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const responseData = await response.json();
    if (response.status !== 201) {
      throw new Error(responseData);
    }
    return responseData;
  },

  async wallets(user:LoggedUserType): Promise<WalletProps[]> {
    const response = await fetch(`${WALLET_WEB_URL}/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`,
      },
    });

    const responseData = await response.json();
    if (response.status !== 200) {
      throw new Error(responseData);
    }
    return responseData;
  },

  async connect(user:LoggedUserType, address: string): Promise<WalletProps> {
    const response = await fetch(`${WALLET_WEB_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({ address: address })
    });

    const responseData = await response.json();
    if (response.status !== 201) {
      throw new Error(responseData);
    }
    return responseData;
  }
};

export { WalletController };