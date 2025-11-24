package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Class;
import com.groupe.gestion_.de_.notes.dto.ClassRequest;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;
import com.groupe.gestion_.de_.notes.repository.ClassRepository;
import com.groupe.gestion_.de_.notes.repository.EnrollmentRepository;
import com.groupe.gestion_.de_.notes.repository.TeacherClassRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepository;
    private final TeacherClassRepository teacherClassRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public ClassResponse createClass(ClassRequest request) {
        if (classRepository.existsByName(request.getName())) {
            throw new BadRequestException("Class with name '" + request.getName() + "' already exists.");
        }
        Class newClass = Class.builder()
                .name(request.getName())
                .academicYear(request.getAcademicYear())
                .build();
        Class savedClass = classRepository.save(newClass);
        return mapToResponse(savedClass);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ClassResponse> getClassById(Long id) {
        return classRepository.findById(id).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassResponse> getAllClasses() {
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassResponse> getClassesByTeacherIdNum(String teacherIdNum) {
        return teacherClassRepository.findByTeacher_TeacherIdNum(teacherIdNum).stream()
                .map(tc -> mapToResponse(tc.getClassEntity()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassResponse> getClassesByStudentIdNum(String studentIdNum) {
        return enrollmentRepository.findByStudentStudentIdNum(studentIdNum).stream()
                .map(e -> mapToResponse(e.getClassEntity()))
                .distinct() // A student might be enrolled in multiple subjects in the same class
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClassResponse updateClass(Long id, ClassRequest request) {
        Class existingClass = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + id));

        if (!existingClass.getName().equals(request.getName()) && classRepository.existsByName(request.getName())) {
            throw new BadRequestException("Class with name '" + request.getName() + "' already exists.");
        }

        existingClass.setName(request.getName());
        existingClass.setAcademicYear(request.getAcademicYear());
        Class updatedClass = classRepository.save(existingClass);
        return mapToResponse(updatedClass);
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class not found with ID: " + id);
        }
        // TODO: Consider adding logic to check for dependent entities (e.g., enrolled students, assigned teachers)
        classRepository.deleteById(id);
    }

    private ClassResponse mapToResponse(Class mapclass) {
        return ClassResponse.builder()
                .id(mapclass.getId())
                .name(mapclass.getName())
                .academicYear(mapclass.getAcademicYear())
                .build();
    }
}
