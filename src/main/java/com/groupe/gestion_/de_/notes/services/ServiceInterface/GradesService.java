package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.*;
import java.util.List;
import java.util.Optional;

public interface GradesService {
    GradeResponse addGrade(GradeRequest request);
    Optional<GradeResponse> findGradeById(Long id);
    List<GradeResponse> getAllGrades();
    List<GradeResponse> findGradesByStudentIdNum(String studentIdNum);
    List<GradeResponse> findGradesBySubjectCode(String subjectCode);
    List<GradeResponse> findGradesByStudentIdNumAndSubjectCode(String studentIdNum, String subjectCode);
    GradeResponse updateGrade(Long id, GradeRequest request);
    void deleteGrade(Long id);

    // Methods for calculating averages
    Double calculateStudentAverageGradeForSubject(String studentIdNum, String subjectCode);
    Double calculateStudentOverallAverageGrade(String studentIdNum);
    Double calculateSubjectAverageGrade(String subjectCode);
}
