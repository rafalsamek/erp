package com.smartvizz.erp.backend.web.models;


import com.smartvizz.erp.backend.data.entities.DocumentEntity;

import java.time.Instant;

public record DocumentResponse (Long id, String title, String description, Instant createdAt, Instant updatedAt){
    public DocumentResponse(DocumentEntity entity) {
        this(entity.getId(), entity.getTitle(), entity.getDescription(), entity.getCreatedAt(), entity.getUpdatedAt());
    }
}