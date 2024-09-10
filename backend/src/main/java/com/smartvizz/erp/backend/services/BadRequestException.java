package com.smartvizz.erp.backend.services;

import java.util.LinkedHashMap;
import java.util.Map;

public class BadRequestException extends RuntimeException {
    private final Map<String, String> errors;

    public BadRequestException(Map<String, String> errors) {
        this.errors = new LinkedHashMap<>(errors);
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}

