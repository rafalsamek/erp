package com.smartvizz.erp.backend.web.models;

public record AuthRegisterResponse(
        Long id,
        String username,
        String email,
        boolean enabled
) {}
