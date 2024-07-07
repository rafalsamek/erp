package com.smartvizz.erp.backend.data.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")

public class DocumentEntity {
    @Id
    @GeneratedValue
    @Column(nullable = false)
    private Long id;
}
