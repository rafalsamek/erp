package com.smartvizz.erp.backend.data.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "documents")

public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = true, length = 1000)
    private String description;

    @Column(nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    public Long getId() {
        return id;
    }

    public DocumentEntity(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public DocumentEntity() {

    }

    public void setId(Long id) {
        this.id = id;
    }

    public @Max(100) String getTitle() {
        return title;
    }

    public void setTitle(@Max(100) String title) {
        this.title = title;
    }

    public @Max(1000) String getDescription() {
        return description;
    }

    public void setDescription(@Max(1000) String description) {
        this.description = description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
