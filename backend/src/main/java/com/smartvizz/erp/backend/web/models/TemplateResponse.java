package com.smartvizz.erp.backend.web.models;


import com.smartvizz.erp.backend.data.entities.TemplateEntity;
import java.time.Instant;

public record TemplateResponse (
        Long id,
        String title,
        String description,
        String fileName,
        String filePath,
        String fileType,
        Long fileSize,
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
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}