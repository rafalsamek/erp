package com.smartvizz.erp.backend.web.models;


import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public record TemplateResponse (
        Long id,
        String title,
        String description,
        String fileName,
        String filePath,
        String fileType,
        Long fileSize,
        List<CategoryResponse> categories, // Added field for categories
        UserResponse user,
        Instant createdAt,
        Instant updatedAt
) {
    public TemplateResponse(TemplateEntity entity) {
        this(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getFileName(),
                entity.getFilePath(),
                entity.getFileType(),
                entity.getFileSize(),
                entity.getCategories() != null ? entity.getCategories().stream()
                        .map(CategoryResponse::new)
                        .collect(Collectors.toList()) : null,
                new UserResponse(entity.getUser()),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}