package com.smartvizz.erp.backend.web.models;


import com.smartvizz.erp.backend.data.entities.TemplateEntity;

import java.time.Instant;

public record TemplateResponse(Long id, String title, String description, Instant createdAt, Instant updatedAt){
    public TemplateResponse(TemplateEntity entity) {
        this(entity.getId(), entity.getTitle(), entity.getDescription(), entity.getCreatedAt(), entity.getUpdatedAt());
    }
}