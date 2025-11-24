package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.dto.GradeRequest;
import com.groupe.gestion_.de_.notes.dto.GradeResponse;
import com.groupe.gestion_.de_.notes.model.Grade;
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.model.User;
import com.groupe.gestion_.de_.notes.repository.GradeRepository;
import com.groupe.gestion_.de_.notes.repository.SubjectRepository;
import com.groupe.gestion_.de_.notes.repository.UserRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GradeServiceImpl implements GradeService {

    private final GradeRepository gradeRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public GradeResponse createGrade(GradeRequest request) {
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Matière non trouvée"));
        
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

        Grade grade = Grade.builder()
                .value(request.getValue())
                .coefficient(request.getCoefficient())
                .comment(request.getComment())
                .date(request.getDate() != null ? request.getDate() : LocalDateTime.now())
                .student(student)
                .subject(subject)
                .teacher(teacher)
                .build();

        Grade savedGrade = gradeRepository.save(grade);
        return mapToResponse(savedGrade);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GradeResponse> findById(Long id) {
        return gradeRepository.findById(id).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeResponse> findByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeResponse> findBySubjectId(Long subjectId) {
        return gradeRepository.findBySubjectId(subjectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeResponse> findByTeacherId(Long teacherId) {
        return gradeRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GradeResponse updateGrade(Long id, GradeRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note non trouvée"));

        grade.setValue(request.getValue());
        grade.setCoefficient(request.getCoefficient());
        grade.setComment(request.getComment());
        
        if (request.getDate() != null) {
            grade.setDate(request.getDate());
        }

        Grade updatedGrade = gradeRepository.save(grade);
        return mapToResponse(updatedGrade);
    }

    @Override
    public void deleteGrade(Long id) {
        if (!gradeRepository.existsById(id)) {
            throw new RuntimeException("Note non trouvée");
        }
        gradeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateStudentAverage(Long studentId) {
        Double average = gradeRepository.findWeightedAverageByStudent(studentId);
        return average != null ? Math.round(average * 100.0) / 100.0 : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateSubjectAverage(Long studentId, Long subjectId) {
        Double average = gradeRepository.findAverageByStudentAndSubject(studentId, subjectId);
        return average != null ? Math.round(average * 100.0) / 100.0 : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateGlobalAverage() {
        Double average = gradeRepository.findGlobalAverage();
        return average != null ? Math.round(average * 100.0) / 100.0 : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Long getTotalGradesCount() {
        return gradeRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Long getStudentsAboveAverage(Double threshold) {
        return gradeRepository.countStudentsAboveAverage(threshold);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getStudentsWithGrades() {
        return gradeRepository.countDistinctStudents();
    }

    private GradeResponse mapToResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .value(grade.getValue())
                .coefficient(grade.getCoefficient())
                .comment(grade.getComment())
                .date(grade.getDate())
                .studentId(grade.getStudent().getId())
                .studentName(grade.getStudent().getFirstname() + " " + grade.getStudent().getLastname())
                .subjectId(grade.getSubject().getId())
                .subjectName(grade.getSubject().getName())
                .teacherId(grade.getTeacher().getId())
                .teacherName(grade.getTeacher().getFirstname() + " " + grade.getTeacher().getLastname())
                .createdAt(grade.getCreatedAt())
                .build();
    }
}