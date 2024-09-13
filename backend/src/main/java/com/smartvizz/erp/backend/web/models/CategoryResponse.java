package com.smartvizz.erp.backend.web.models;


import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import com.smartvizz.erp.backend.data.entities.DocumentEntity;

import java.time.Instant;

public record CategoryResponse (Long id, String name, String description, UserResponse user, Instant createdAt, Instant updatedAt){
    public CategoryResponse(CategoryEntity entity) {
        this(entity.getId(), entity.getName(), entity.getDescription(), new UserResponse(entity.getUser()), entity.getCreatedAt(), entity.getUpdatedAt());
    }

}