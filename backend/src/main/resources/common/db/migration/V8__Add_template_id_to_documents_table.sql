ALTER TABLE documents
    ADD COLUMN template_id BIGINT NULL AFTER file_size,
    ADD CONSTRAINT fk_template_id FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL;
