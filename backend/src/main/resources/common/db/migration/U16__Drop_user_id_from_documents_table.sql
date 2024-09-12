USE expenses;

ALTER TABLE expenses
    DROP FOREIGN KEY fk_user_expense;

ALTER TABLE expenses
    DROP COLUMN user_id;
