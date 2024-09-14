USE erp;

ALTER TABLE templates
ADD COLUMN user_id BIGINT UNSIGNED NOT NULL DEFAULT 1 AFTER file_size,
ADD CONSTRAINT fk_user_template FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;