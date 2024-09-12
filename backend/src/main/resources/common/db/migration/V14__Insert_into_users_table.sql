USE erp;

INSERT INTO users (
                    id,
                    username,
                    email,
                    password,
                    enabled,
                    activation_code,
                    created_at,
                    updated_at
)
VALUES (
           1,
           'demo',
           'demo@demo',
           '$2a$10$TilYcJaZLiadukAYQ82Eo.u9sN0YxyZcLjybM3Y2gcZbjMtw5D07G',
           1,
           NULL,
           '2024-09-12 02:06:30',
           '2024-09-12 02:06:55'
       );
