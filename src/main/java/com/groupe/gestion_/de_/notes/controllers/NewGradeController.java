package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.GradeRequest;
import com.groupe.gestion_.de_.notes.dto.GradeResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/new-grades")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "New Grade Management", description = "API for managing student grades - new system")
public class NewGradeController {

    private final GradeService gradeService;

    @Operation(summary = "Create a new grade")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeResponse> createGrade(@Valid @RequestBody GradeRequest request) {
        GradeResponse response = gradeService.createGrade(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get grade by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<GradeResponse> getGradeById(@PathVariable Long id) {
        return gradeService.findById(id)
                .map(grade -> ResponseEntity.ok(grade))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get grades by student ID")
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or #studentId == authentication.principal.id")
    public ResponseEntity<List<GradeResponse>> getGradesByStudent(@PathVariable Long studentId) {
        List<GradeResponse> grades = gradeService.findByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }

    @Operation(summary = "Get grades by subject ID")
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<GradeResponse>> getGradesBySubject(@PathVariable Long subjectId) {
        List<GradeResponse> grades = gradeService.findBySubjectId(subjectId);
        return ResponseEntity.ok(grades);
    }

    @Operation(summary = "Get grades by teacher ID")
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('ADMIN') or #teacherId == authentication.principal.id")
    public ResponseEntity<List<GradeResponse>> getGradesByTeacher(@PathVariable Long teacherId) {
        List<GradeResponse> grades = gradeService.findByTeacherId(teacherId);
        return ResponseEntity.ok(grades);
    }

    @Operation(summary = "Update a grade")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeResponse> updateGrade(@PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        GradeResponse response = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a grade")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Calculate student average")
    @GetMapping("/student/{studentId}/average")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or #studentId == authentication.principal.id")
    public ResponseEntity<Double> getStudentAverage(@PathVariable Long studentId) {
        Double average = gradeService.calculateStudentAverage(studentId);
        return ResponseEntity.ok(average);
    }

    @Operation(summary = "Calculate subject average for student")
    @GetMapping("/student/{studentId}/subject/{subjectId}/average")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or #studentId == authentication.principal.id")
    public ResponseEntity<Double> getSubjectAverage(@PathVariable Long studentId, @PathVariable Long subjectId) {
        Double average = gradeService.calculateSubjectAverage(studentId, subjectId);
        return ResponseEntity.ok(average);
    }
}