USE erp;

ALTER TABLE categories
    DROP FOREIGN KEY fk_user_category;

ALTER TABLE categories
    DROP COLUMN user_id;
