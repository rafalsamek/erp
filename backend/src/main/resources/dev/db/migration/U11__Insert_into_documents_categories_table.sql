USE erp;

DELETE FROM documents_categories
       WHERE document_id BETWEEN 1 AND 64
        AND category_id BETWEEN 1 AND 10;
