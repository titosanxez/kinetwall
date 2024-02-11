DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS wallets;
DROP TYPE IF EXISTS WALLET_TOKEN_TYPE;

CREATE TABLE users (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   username text UNIQUE NOT NULL,
   password_hash bytea UNIQUE NOT NULL
);
CREATE UNIQUE INDEX username_idx ON users (username);

CREATE TYPE WALLET_TOKEN_TYPE AS ENUM ('ETH');
CREATE TABLE wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address text UNIQUE NOT NULL,
    token_type WALLET_TOKEN_TYPE NOT NULL,
    owner UUID NOT NULL
);

CREATE UNIQUE INDEX address_idx ON wallets (address);