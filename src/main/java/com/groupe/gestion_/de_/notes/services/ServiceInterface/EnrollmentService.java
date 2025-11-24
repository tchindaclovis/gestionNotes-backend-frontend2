package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.EnrollmentRequest;
import com.groupe.gestion_.de_.notes.dto.EnrollmentResponse;

import java.util.List;
import java.util.Optional;

public interface EnrollmentService {
    EnrollmentResponse createEnrollment(EnrollmentRequest request);
    Optional<EnrollmentResponse> getEnrollmentById(Long id);
    List<EnrollmentResponse> getAllEnrollments();
    List<EnrollmentResponse> getEnrollmentsByStudentIdNum(String studentIdNum);
    List<EnrollmentResponse> getEnrollmentsByClassId(Long classId);
    List<EnrollmentResponse> getEnrollmentsByStudentIdNumAndClassEntity_Id(String studentIdNum, Long classId);
    void deleteEnrollment(Long id);
}
