package com.smartvizz.erp.backend.services;

/**
 * Exception thrown when a requested resource is not found.
 */
public class NotFoundException extends RuntimeException {

    /**
     * Constructs a new NotFoundException with {@code null} as its detail message.
     * The cause is not initialized.
     */
    public NotFoundException() {
        super();
    }

    /**
     * Constructs a new NotFoundException with the specified detail message.
     * The cause is not initialized.
     *
     * @param message the detail message
     */
    public NotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs a new NotFoundException with the specified detail message and cause.
     *
     * @param message the detail message
     * @param cause   the cause of the exception
     */
    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new NotFoundException with the specified cause.
     * The detail message is set to {@code (cause == null ? null : cause.toString())}.
     *
     * @param cause the cause of the exception
     */
    public NotFoundException(Throwable cause) {
        super(cause);
    }
}
