USE erp;

CREATE TABLE documents_categories (
                                   document_id BIGINT UNSIGNED,
                                   category_id BIGINT UNSIGNED,
                                   PRIMARY KEY (document_id, category_id),
                                   FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
                                   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
