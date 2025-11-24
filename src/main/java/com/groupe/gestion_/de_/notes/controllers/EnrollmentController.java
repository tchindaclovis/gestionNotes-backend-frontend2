package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.EnrollmentRequest;
import com.groupe.gestion_.de_.notes.dto.EnrollmentResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.EnrollmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Tag(name = "Enrollment Management", description = "API for managing student enrollments in classes and subjects")
@CrossOrigin(origins = "http://localhost:4200")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;


    @Operation(summary = "Create a new enrollment", description = "Allows Admins to enroll a student in a class and subject.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Enrollment created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or student is already enrolled"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can create enrollments"),
            @ApiResponse(responseCode = "404", description = "Student, Class, or Subject not found")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponse> createEnrollment(@Valid @RequestBody EnrollmentRequest request) {
        EnrollmentResponse response = enrollmentService.createEnrollment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all enrollments", description = "Retrieve a list of all enrollments in the system.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of enrollments retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins or Teachers can view all enrollments")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<EnrollmentResponse>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentService.getAllEnrollments());
    }

    @Operation(summary = "Get an enrollment by ID", description = "Retrieve a specific enrollment by its unique ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollment found"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient privileges"),
            @ApiResponse(responseCode = "404", description = "Enrollment not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('TEACHER') and @securityService.isTeacherAssignedToEnrollment(#id)) or " +
            "(hasRole('STUDENT') and @securityService.isStudentOwnerOfEnrollment(#id))")
    public ResponseEntity<EnrollmentResponse> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Enrollment not found with ID: " + id));
    }

    @Operation(summary = "Get enrollments by student", description = "Retrieve all enrollments for a specific student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Enrollments retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient privileges"),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @GetMapping("/student/{studentIdNum}")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('TEACHER') and @securityService.isTeacherAssignedToStudent(#studentId)) or " +
            "(hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudentIdNum(@PathVariable String studentIdNum) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudentIdNum(studentIdNum));
    }

    @Operation(summary = "Delete an enrollment", description = "Deletes a specific enrollment record. Only Admins can perform this action.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Enrollment deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can delete enrollments"),
            @ApiResponse(responseCode = "404", description = "Enrollment not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
