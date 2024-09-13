package com.smartvizz.erp.backend.data.repositories;

import com.smartvizz.erp.backend.data.entities.CategoryEntity;
import com.smartvizz.erp.backend.data.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long>, JpaSpecificationExecutor<CategoryEntity> {

    Optional<CategoryEntity> findByIdAndUser(Long id, UserEntity user);
}
