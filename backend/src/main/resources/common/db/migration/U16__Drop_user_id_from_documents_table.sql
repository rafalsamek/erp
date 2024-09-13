USE erp;

ALTER TABLE documents
    DROP FOREIGN KEY fk_user_document;

ALTER TABLE documents
    DROP COLUMN user_id;
