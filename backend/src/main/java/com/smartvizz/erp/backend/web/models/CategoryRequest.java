package com.smartvizz.erp.backend.web.models;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotNull(message = "Category is required")
        @Size(min = 1, max = 255, message = "Category must be between 1 and 255 characters")
        String name,

        @Size(max = 1000, message = "Description must be up to 1000 characters")
        String description
) {
}
