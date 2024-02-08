DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS disbursements;
DROP TABLE IF EXISTS monthly_fees;
-- DROP TYPE IF EXISTS DISBURSEMENT_FREQUENCY;

-- CREATE TYPE DISBURSEMENT_FREQUENCY AS ENUM ('DAILY', 'WEEKLY');
CREATE TABLE users (
   id UUID PRIMARY KEY,
   username text UNIQUE NOT NULL,
   email text UNIQUE NOT NULL,
   password NOT NULL
);
CREATE UNIQUE INDEX username_idx ON users (username);

CREATE TABLE orders (
   id bytea PRIMARY KEY,
   merchant_reference text NOT NULL,
   amount text NOT NULL,
   created_at DATE NOT NULL
);
\copy orders FROM 'persistence/orders.csv' DELIMITER ';' CSV HEADER;

-- Modify 'orders' table after importing data, to avoid missing column errors
ALTER TABLE orders ADD  disbursement_id UUID;
CREATE INDEX merchant_created_at_disbursement_idx ON orders (merchant_reference, created_at, disbursement_id);

CREATE TABLE disbursements (
   id UUID PRIMARY KEY,
   merchant_id UUID NOT NULL,
   at_date DATE NOT NULL,
   amount_total text,
   amount_disbursed text,
   amount_fee text,
   order_count bigint,
   reference UUID UNIQUE NOT NULL
);
CREATE UNIQUE INDEX disbursements_merchant_and_date_idx ON disbursements (merchant_id, at_date);

CREATE TABLE monthly_fees (
   merchant_id UUID NOT NULL,
   at_date DATE NOT NULL,
   amount_disbursed_total text,
   amount_fee_total text,
   amount_extra_fee text,
   constraint mf_primary_key primary key (merchant_id, at_date)
);
CREATE UNIQUE INDEX monthly_fees_merchant_and_date_idx ON monthly_fees (merchant_id, at_date);