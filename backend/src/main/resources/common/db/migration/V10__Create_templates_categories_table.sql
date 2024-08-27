USE erp;

CREATE TABLE templates_categories (
                                   template_id BIGINT UNSIGNED,
                                   category_id BIGINT UNSIGNED,
                                   PRIMARY KEY (template_id, category_id),
                                   FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
                                   FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
