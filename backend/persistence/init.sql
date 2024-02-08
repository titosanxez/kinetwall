DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   username text UNIQUE NOT NULL,
   password_hash bytea UNIQUE NOT NULL,
   email text UNIQUE NOT NULL
);
CREATE UNIQUE INDEX username_idx ON users (username);