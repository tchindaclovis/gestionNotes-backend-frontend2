package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.LoginRecord;
import com.groupe.gestion_.de_.notes.model.User;
import com.groupe.gestion_.de_.notes.dto.LoginRecordResponse;
import com.groupe.gestion_.de_.notes.dto.UserResponse;
import com.groupe.gestion_.de_.notes.repository.LoginRecordRepository;
import com.groupe.gestion_.de_.notes.repository.UserRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.LoginRecordsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoginRecordsServiceImpl implements LoginRecordsService {

    private final LoginRecordRepository loginRecordRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void recordLogin(String username, String ipAddress) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        LoginRecord loginRecord = new LoginRecord(user, LocalDateTime.now(), ipAddress);
        loginRecordRepository.save(loginRecord);
    }

    @Override
    @Transactional
    public void recordLogout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Find the latest login record for the user that does not have a logout time
        loginRecordRepository.findTopByUserIdAndLogOutNullOrderByLogInDesc(user.getId())
                .ifPresent(record -> {
                    record.setLogOut(LocalDateTime.now());
                    loginRecordRepository.save(record);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoginRecordResponse> getAllLoginRecords() {
        return loginRecordRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LoginRecordResponse> getLoginRecordsByUser_Id(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return loginRecordRepository.findByUser_IdOrderByLogInDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LoginRecordResponse> getLoginRecordById(Long id) {
        return loginRecordRepository.findById(id).map(this::mapToResponse);
    }

    private LoginRecordResponse mapToResponse(LoginRecord record) {
        UserResponse userResponse = new UserResponse(
                record.getUser().getId(),
                record.getUser().getUsername(),
                record.getUser().getFirstname(),
                record.getUser().getLastname(),
                record.getUser().getEmail(),
                record.getUser().getRole()
        );

        return new LoginRecordResponse(
                record.getId(),
                userResponse,
                record.getLogIn(),
                record.getLogOut(),
                record.getIpAddress()
        );
    }
}
