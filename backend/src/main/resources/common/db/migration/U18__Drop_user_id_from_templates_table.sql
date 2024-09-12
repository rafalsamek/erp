USE erp;

ALTER TABLE wallets
    DROP FOREIGN KEY fk_user_wallet;

ALTER TABLE wallets
    DROP COLUMN user_id;
