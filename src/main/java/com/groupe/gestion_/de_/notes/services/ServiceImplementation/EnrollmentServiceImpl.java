package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Enrollment;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.model.Class; // Renamed to avoid keyword conflict
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.dto.EnrollmentRequest;
import com.groupe.gestion_.de_.notes.dto.EnrollmentResponse;
import com.groupe.gestion_.de_.notes.dto.StudentResponse;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;
import com.groupe.gestion_.de_.notes.repository.EnrollmentRepository;
import com.groupe.gestion_.de_.notes.repository.StudentRepository;
import com.groupe.gestion_.de_.notes.repository.ClassRepository;
import com.groupe.gestion_.de_.notes.repository.SubjectRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        if (enrollmentRepository.existsByStudent_StudentIdNumAndClassEntity_IdAndSubject_SubjectCode(
                request.getStudentIdNum(), request.getClassId(), request.getSubjectCode())) {
            throw new BadRequestException("Student is already enrolled in this subject for this class.");
        }

        Student student = studentRepository.findByStudentIdNum(request.getStudentIdNum())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentIdNum()));
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + request.getClassId()));
        Subject subject = subjectRepository.findBySubjectCode(request.getSubjectCode())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + request.getSubjectCode()));

        Enrollment enrollment = new Enrollment(null, student, classEntity, subject);
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToResponse(savedEnrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EnrollmentResponse> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByStudentIdNum(String studentIdNum) {
        if (!studentRepository.existsByStudentIdNum(studentIdNum)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentIdNum);
        }
        return enrollmentRepository.findByStudentStudentIdNum(studentIdNum).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByClassId(Long classId) {
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with ID: " + classId);
        }
        return enrollmentRepository.findByClassEntity_Id(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByStudentIdNumAndClassEntity_Id(String studentIdNum, Long classId) {
        if (!studentRepository.existsByStudentIdNum(studentIdNum)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentIdNum);
        }
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with ID: " + classId);
        }
        return enrollmentRepository.findByStudentStudentIdNumAndClassEntity_Id(studentIdNum, classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found with ID: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        StudentResponse studentResponse = new StudentResponse(
                enrollment.getStudent().getId(),
                enrollment.getStudent().getUsername(),
                enrollment.getStudent().getFirstname(),
                enrollment.getStudent().getLastname(),
                enrollment.getStudent().getEmail(),
                enrollment.getStudent().getRole(),
                enrollment.getStudent().getStudentIdNum()
        );

        ClassResponse classResponse = new ClassResponse(
                enrollment.getClassEntity().getId(),
                enrollment.getClassEntity().getName(),
                enrollment.getClassEntity().getAcademicYear()
        );

        SubjectResponse subjectResponse = new SubjectResponse(
                enrollment.getSubject().getId(),
                enrollment.getSubject().getSubjectCode(),
                enrollment.getSubject().getName(),
                enrollment.getSubject().getCoefficient(),
                enrollment.getSubject().getDescription()
        );

        return new EnrollmentResponse(
                enrollment.getId(),
                studentResponse,
                subjectResponse,
                classResponse
                );
    }
}
