package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
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
        return documentRepository.findAll()
                .stream()
                .map(DocumentResponse::new)
                .toList();
    }

    public DocumentResponse fetchOne(Long id) {
             return documentRepository.findById(id)
                     .map(DocumentResponse::new)
                     .orElseThrow(NotFoundException::new);
         }


    public DocumentResponse create(DocumentRequest request) {
        DocumentEntity documentEntity = new DocumentEntity(request.title(), request.description());
        DocumentEntity savedDocument = documentRepository.save(documentEntity);

        return new DocumentResponse(savedDocument);
    }

    public DocumentResponse update(Long id, DocumentRequest request) {
        DocumentEntity documentEntity = documentRepository.getReferenceById(id);
//        documentEntity.setTitle(request.title());
        documentEntity.setDescription(request.description());

        DocumentEntity updatedDocument = documentRepository.save(documentEntity);

        return new DocumentResponse(updatedDocument);
    }


    public void delete(Long id) {
        documentRepository.deleteById(id);
    }
}
