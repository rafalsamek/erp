USE erp;

DELETE FROM templates_categories
       WHERE template_id BETWEEN 1 AND 63
        AND category_id BETWEEN 1 AND 10;
