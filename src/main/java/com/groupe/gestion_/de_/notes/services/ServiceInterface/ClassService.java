package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.ClassRequest;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;

import java.util.List;
import java.util.Optional;

public interface ClassService {
    ClassResponse createClass(ClassRequest request);
    Optional<ClassResponse> getClassById(Long id);
    List<ClassResponse> getAllClasses();
    List<ClassResponse> getClassesByTeacherIdNum(String teacherIdNum);
    List<ClassResponse> getClassesByStudentIdNum(String studentIdNum);
    ClassResponse updateClass(Long id, ClassRequest request);
    void deleteClass(Long id);
}
