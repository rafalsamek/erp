USE erp;

CREATE TABLE blacklisted_tokens (
                                    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                    token VARCHAR(512) NOT NULL UNIQUE,
                                    expiry_date TIMESTAMP NOT NULL
);
