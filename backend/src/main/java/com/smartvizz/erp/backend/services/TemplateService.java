package com.smartvizz.erp.backend.services;

import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import com.smartvizz.erp.backend.data.entities.UserEntity;
import com.smartvizz.erp.backend.data.repositories.TemplateRepository;
import com.smartvizz.erp.backend.data.repositories.CategoryRepository;
import com.smartvizz.erp.backend.data.repositories.UserRepository;
import com.smartvizz.erp.backend.data.specifications.CategorySpecifications;
import com.smartvizz.erp.backend.data.specifications.TemplateSpecifications;
import com.smartvizz.erp.backend.web.models.TemplateRequest;
import com.smartvizz.erp.backend.web.models.TemplateResponse;
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
public class TemplateService {

    private final TemplateRepository templateRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(TemplateService.class);
    private final String uploadDir = "uploads/templates";

    public TemplateService(TemplateRepository templateRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.templateRepository = templateRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public PageDTO<TemplateResponse> fetchAll(
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
        Specification<TemplateEntity> spec = Specification.where(TemplateSpecifications.searchTemplate(searchBy))
                .and(TemplateSpecifications.byUser(userEntity));


        // Fetch templates filtered by user and map entities to DTOs
        Page<TemplateEntity> templatePage = templateRepository.findAll(spec, pageable);
        List<TemplateResponse> templateResponses = templatePage.map(TemplateResponse::new).getContent();

        // Create and return PageDTO
        return new PageDTO<>(
                templateResponses,
                templatePage.getNumber(),
                templatePage.getSize(),
                templatePage.getTotalElements(),
                templatePage.getTotalPages()
        );
    }

        public TemplateResponse fetchOne (Integer id, User user){
            // Fetch UserEntity based on the authenticated user
            UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

            // Fetch the template filtered by user
            return templateRepository.findByIdAndUser(id, userEntity)
                    .map(TemplateResponse::new)
                    .orElseThrow(() -> new NotFoundException("Template not found with id: " + id));
        }

        public TemplateResponse create (TemplateRequest request, User user){
            UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

            TemplateEntity templateEntity = new TemplateEntity(
                    request.title(),
                    request.description(),
                    userEntity
            );

            return getTemplateResponse(request, templateEntity);
        }

        public TemplateResponse update (Integer id, TemplateRequest request, User user){
            UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

            TemplateEntity templateEntity = templateRepository.findByIdAndUser(id, userEntity)
                    .orElseThrow(() -> new NotFoundException("Template not found with id: " + id));

            templateEntity.setTitle(request.title());
            templateEntity.setDescription(request.description());
            templateEntity.setUser(userEntity);

            return getTemplateResponse(request, templateEntity);
        }

        public void delete (Integer id, User user){
            UserEntity userEntity = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new NotFoundException("User not found with username: " + user.getUsername()));

            TemplateEntity templateEntity = templateRepository.findByIdAndUser(id, userEntity)
                    .orElseThrow(() -> new NotFoundException("Template not found with id: " + id));

            templateRepository.delete(templateEntity);
        }

    private TemplateResponse getTemplateResponse(TemplateRequest request, TemplateEntity templateEntity) {
        if (request.hasFile()) {
            String filePath = saveFile(request);
            templateEntity.setFilePath(filePath);
            templateEntity.setFileName(request.getFileName());
            templateEntity.setFileType(request.getFileType());
            templateEntity.setFileSize(request.getFileSize());
        }

        if (request.categoryIds() != null) {
            List<CategoryEntity> categories = request.categoryIds().stream()
                    .map(categoryId -> categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId)))
                    .toList();
            templateEntity.setCategories(new ArrayList<>(categories));
        }

        TemplateEntity updatedTemplate = templateRepository.save(templateEntity);

        return new TemplateResponse(updatedTemplate);
    }

    private String saveFile(TemplateRequest request) {
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
