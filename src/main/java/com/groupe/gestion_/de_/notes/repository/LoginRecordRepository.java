package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.LoginRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoginRecordRepository extends JpaRepository<LoginRecord, Long> {
    List<LoginRecord> findByUser_IdOrderByLogInDesc(Long userId);
    Optional<LoginRecord> findTopByUserIdAndLogOutNullOrderByLogInDesc(Long userId);
}