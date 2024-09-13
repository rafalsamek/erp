USE erp;

ALTER TABLE templates
    DROP FOREIGN KEY fk_user_template;

ALTER TABLE templates
    DROP COLUMN user_id;
