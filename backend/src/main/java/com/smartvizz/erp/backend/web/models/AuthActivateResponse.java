package com.smartvizz.erp.backend.web.models;

public record AuthActivateResponse(
        String message,
        String username, // Optional username for auto-login after activation
        String token // Optional token for auto-login after activation
) {
    public AuthActivateResponse(String message) {
        this(message, null, null); // Default constructor with only the message, no username and token
    }
}
