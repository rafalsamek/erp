package com.smartvizz.erp.backend.data.repositories;

import com.smartvizz.erp.backend.data.entities.DocumentEntity;
import com.smartvizz.erp.backend.data.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long>, JpaSpecificationExecutor<DocumentEntity> {
    Optional<DocumentEntity> findByIdAndUser(Long id, UserEntity user);
}
