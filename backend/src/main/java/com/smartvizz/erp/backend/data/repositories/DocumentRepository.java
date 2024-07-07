package com.smartvizz.erp.backend.data.repositories;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
}
