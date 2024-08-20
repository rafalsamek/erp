package com.smartvizz.erp.backend.web.models;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;

import java.time.Instant;

public record DocumentResponse (
        Long id,
        String title,
        String description,
        String fileName,
        String filePath,
        String fileType,
        Long fileSize,
        TemplateResponse template,
        Instant createdAt,
        Instant updatedAt
) {
    public DocumentResponse(DocumentEntity entity) {
        this(
                entity.getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getFileName(),
                entity.getFilePath(),
                entity.getFileType(),
                entity.getFileSize(),
                new TemplateResponse(entity.getTemplate()),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
