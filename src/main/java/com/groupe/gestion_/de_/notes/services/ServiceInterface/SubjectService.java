package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.SubjectRequest;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;

import java.util.List;
import java.util.Optional;

public interface SubjectService {
    SubjectResponse addSubject(SubjectRequest request);
    Optional<SubjectResponse> findBySubjectCode(String subjectCode);
    List<SubjectResponse> getAllSubjects();
    Optional<SubjectResponse> findBySubject_Name(String name);
    SubjectResponse updateSubject(String subjectCode, SubjectRequest request);
    void deleteSubject(Long id);
}