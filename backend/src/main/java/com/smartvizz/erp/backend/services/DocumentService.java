package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import com.smartvizz.erp.backend.data.repositories.DocumentRepository;
import com.smartvizz.erp.backend.data.specifications.DocumentSpecifications;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private final String uploadDir = "uploads/";

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Page<DocumentResponse> fetchAll(
            int page,
            int size,
            String[] sortColumns,
            String[] sortDirections,
            String searchBy
    ) {
        logger.debug("sortColumns: " + Arrays.toString(sortColumns) + ", sortDirections: " + Arrays.toString(sortDirections));
        ArrayList<Sort.Order> sortOrders = new ArrayList<>();

        for (int i = 0; i < sortColumns.length; i++) {
            String sortColumn = sortColumns[i];
            Sort.Direction sortDirection =
                    sortDirections.length > i && sortDirections[i].equalsIgnoreCase("desc")
                            ? Sort.Direction.DESC
                            : Sort.Direction.ASC;

            sortOrders.add(new Sort.Order(sortDirection, sortColumn));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortOrders));

        return documentRepository.findAll(DocumentSpecifications.searchDocument(searchBy), pageable)
                .map(DocumentResponse::new);
    }

    public DocumentResponse fetchOne(Long id) {
        return documentRepository.findById(id)
                .map(DocumentResponse::new)
                .orElseThrow(NotFoundException::new);
    }

    public DocumentResponse create(DocumentRequest request) {
        DocumentEntity documentEntity = new DocumentEntity(request.title(), request.description());

        return getDocumentResponse(request, documentEntity);
    }

    public DocumentResponse update(Long id, DocumentRequest request) {
        DocumentEntity documentEntity = documentRepository.getReferenceById(id);
        documentEntity.setTitle(request.title());
        documentEntity.setDescription(request.description());

        return getDocumentResponse(request, documentEntity);
    }

    public void delete(Long id) {
        documentRepository.deleteById(id);
    }

    private DocumentResponse getDocumentResponse(DocumentRequest request, DocumentEntity documentEntity) {
        if (request.hasFile()) {
            String filePath = saveFile(request);
            documentEntity.setFilePath(filePath);
            documentEntity.setFileName(request.getFileName());
            documentEntity.setFileType(request.getFileType());
            documentEntity.setFileSize(request.getFileSize());
        }

        DocumentEntity updatedDocument = documentRepository.save(documentEntity);

        return new DocumentResponse(updatedDocument);
    }

    private String saveFile(DocumentRequest request) {
        try {
            Path targetLocation = null;
            if (request.hasFile() && request.getFileInputStream() != null) {
                Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
                Files.createDirectories(fileStorageLocation);
                String fileName = System.currentTimeMillis() + "_" + request.getFileName();
                targetLocation = fileStorageLocation.resolve(fileName);
                Files.copy(request.getFileInputStream(), targetLocation);

                return targetLocation.toString();
            }

            return null;
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + request.getFileName() + ". Please try again!", ex);
        }
    }
}
