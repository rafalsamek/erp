package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.repositories.DocumentRepository;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<DocumentResponse> fetchAll() {
        return null;
    }

    public DocumentResponse create(DocumentRequest request) {
        return null;
    }

    public DocumentResponse update(DocumentRequest request) {
        return null;
    }

    public DocumentResponse fetchOne(Long id) {
        return null;
    }

    public void delete(Long id) {
    }
}
