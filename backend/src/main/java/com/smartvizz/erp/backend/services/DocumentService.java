package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import com.smartvizz.erp.backend.data.entities.UserEntity;
import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import com.smartvizz.erp.backend.data.repositories.CategoryRepository;
import com.smartvizz.erp.backend.data.repositories.DocumentRepository;
import com.smartvizz.erp.backend.data.repositories.UserRepository;
import com.smartvizz.erp.backend.data.repositories.TemplateRepository;
import com.smartvizz.erp.backend.data.specifications.DocumentSpecifications;
import com.smartvizz.erp.backend.web.models.DocumentRequest;
import com.smartvizz.erp.backend.web.models.DocumentResponse;
import com.smartvizz.erp.backend.web.models.PageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TemplateRepository templateRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    private final String uploadDir = "uploads/documents";

    public DocumentService(DocumentRepository documentRepository, TemplateRepository templateRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.templateRepository = templateRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public PageDTO<DocumentResponse> fetchAll(
            int page,
            int size,
            String[] sortColumns,
            String[] sortDirections,
            String searchBy,
            User user
    ) {
        logger.debug("sortColumns: " + Arrays.toString(sortColumns) + ", sortDirections: " + Arrays.toString(sortDirections));

        // Fetch UserEntity based on the authenticated user
        UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

        // Validate page and size inputs
        page = Math.max(page, 0);
        size = Math.max(size, 1);

        // Create sort orders from the provided columns and directions
        List<Sort.Order> sortOrders = new ArrayList<>();
        for (int i = 0; i < sortColumns.length; i++) {
            String sortColumn = sortColumns[i];
            Sort.Direction sortDirection =
                    (sortDirections.length > i && sortDirections[i].equalsIgnoreCase("desc"))
                            ? Sort.Direction.DESC
                            : Sort.Direction.ASC;
            sortOrders.add(new Sort.Order(sortDirection, sortColumn));
        }

        // Create Pageable instance
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortOrders));

        // Combine user filtering and search specification
        Specification<DocumentEntity> spec = Specification.where(DocumentSpecifications.searchDocument(searchBy))
                .and(DocumentSpecifications.byUser(userEntity));


        // Fetch and map entities to DTOs, filtering by the authenticated user
        Page<DocumentEntity> documentPage = documentRepository.findAll(spec, pageable);
        List<DocumentResponse> documentResponses = documentPage.map(DocumentResponse::new).getContent();

        // Create and return PageDTO
        return new PageDTO<>(
                documentResponses,
                documentPage.getNumber(),
                documentPage.getSize(),
                documentPage.getTotalElements(),
                documentPage.getTotalPages()
        );
    }

    public DocumentResponse fetchOne(Long id, User user) {
        // Fetch UserEntity based on the authenticated user
        UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

        return documentRepository.findByIdAndUser(id, userEntity)
                .map(DocumentResponse::new)
                .orElseThrow(() -> new NotFoundException("Document not found with id: " + id));
    }

    public DocumentResponse create(DocumentRequest request, User user) {
        UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

        // Handle nullable templateId
        TemplateEntity templateEntity = null;
        if (request.templateId() != null) {
            templateEntity = templateRepository.findById(request.templateId())
                    .orElseThrow(() -> new NotFoundException("Template not found with id: " + request.templateId()));
        }

        DocumentEntity documentEntity = new DocumentEntity(
                request.title(),
                request.description(),
                templateEntity,
                userEntity
        );

        return getDocumentResponse(request, documentEntity);
    }

    public DocumentResponse update(Long id, DocumentRequest request, User user) {
        UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

        DocumentEntity documentEntity = documentRepository.findByIdAndUser(id, userEntity)
                .orElseThrow(() -> new NotFoundException("Document not found with id: " + id));

        // Handle nullable templateId
        TemplateEntity templateEntity = null;
        if (request.templateId() != null) {
            templateEntity = templateRepository.findById(request.templateId())
                    .orElseThrow(() -> new NotFoundException("Template not found with id: " + request.templateId()));
        }

        documentEntity.setTitle(request.title());
        documentEntity.setDescription(request.description());
        documentEntity.setTemplate(templateEntity);
        documentEntity.setUser(userEntity);

        return getDocumentResponse(request, documentEntity);
    }

    public void delete(Long id, User user) {
        UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

        if (!documentRepository.existsById(id)) {
            throw new NotFoundException("Document not found with id: " + id);
        }
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

        if (request.categoryIds() != null) {
            List<CategoryEntity> categories = request.categoryIds().stream()
                    .map(categoryId -> categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId)))
                    .toList();
            documentEntity.setCategories(new ArrayList<>(categories));
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
