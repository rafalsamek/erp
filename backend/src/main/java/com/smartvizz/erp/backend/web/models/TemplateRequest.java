package com.smartvizz.erp.backend.web.models;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public record TemplateRequest(
        @NotNull(message = "Title is required")
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        @Size(max = 1000, message = "Description must be up to 1000 characters")
        String description,

        MultipartFile file,

        List<Long> categoryIds
) {
        public boolean hasFile() {
                return file != null && !file.isEmpty();
        }

        public String getFileName() {
                return hasFile() ? file.getOriginalFilename() : null;
        }

        public String getFileType() {
                return hasFile() ? file.getContentType() : null;
        }

        public Long getFileSize() {
                return hasFile() ? file.getSize() : 0;
        }

        public InputStream getFileInputStream() throws IOException {
                return hasFile() ? file.getInputStream() : null;
        }
}