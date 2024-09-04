package com.smartvizz.erp.backend.data.repositories;

import com.smartvizz.erp.backend.data.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByActivationCode(String activationCode);
}
