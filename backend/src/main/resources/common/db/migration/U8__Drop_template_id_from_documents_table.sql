ALTER TABLE documents
    DROP FOREIGN KEY fk_template_id;

ALTER TABLE documents
    DROP COLUMN template_id;
