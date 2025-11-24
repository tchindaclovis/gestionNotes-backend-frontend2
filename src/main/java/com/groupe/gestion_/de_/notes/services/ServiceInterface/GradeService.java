package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.GradeRequest;
import com.groupe.gestion_.de_.notes.dto.GradeResponse;

import java.util.List;
import java.util.Optional;

public interface GradeService {
    
    GradeResponse createGrade(GradeRequest request);
    
    Optional<GradeResponse> findById(Long id);
    
    List<GradeResponse> findByStudentId(Long studentId);
    
    List<GradeResponse> findBySubjectId(Long subjectId);
    
    List<GradeResponse> findByTeacherId(Long teacherId);
    
    GradeResponse updateGrade(Long id, GradeRequest request);
    
    void deleteGrade(Long id);
    
    Double calculateStudentAverage(Long studentId);
    
    Double calculateSubjectAverage(Long studentId, Long subjectId);
    
    Double calculateGlobalAverage();
    
    Long getTotalGradesCount();
    
    Long getStudentsAboveAverage(Double threshold);
    
    Long getStudentsWithGrades();
}