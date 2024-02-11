import * as React from 'react';
import {
  LoggedUserType,
  WalletController,
  LoginCredentials,
} from '../controllers/wallet.controller';

interface AuthContextType {
  user: LoggedUserType | null;
  signin: (credentials: LoginCredentials) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<LoggedUserType|null>(null);

  let login = async (credentials: LoginCredentials) => {
    const loggedUser = await WalletController.login(credentials);
    if (loggedUser.access_token) {
      setUser(loggedUser)
    }
  };

  let value = { user, signin: login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}