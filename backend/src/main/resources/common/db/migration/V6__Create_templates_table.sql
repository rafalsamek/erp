USE erp;

CREATE TABLE templates (
                          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          title VARCHAR(255) NOT NULL,
                          description VARCHAR(1000),
                          file_name VARCHAR(255),
                          file_path VARCHAR(500),
                          file_type VARCHAR(100),
                          file_size BIGINT UNSIGNED,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
