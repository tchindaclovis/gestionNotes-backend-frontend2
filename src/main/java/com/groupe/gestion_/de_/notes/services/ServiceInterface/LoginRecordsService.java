package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.LoginRecordResponse;

import java.util.List;
import java.util.Optional;

public interface LoginRecordsService {
    void recordLogin(String username, String ipAddress);
    void recordLogout(String username);
    List<LoginRecordResponse> getAllLoginRecords();
    List<LoginRecordResponse> getLoginRecordsByUser_Id(Long userId);
    Optional<LoginRecordResponse> getLoginRecordById(Long id);
}
