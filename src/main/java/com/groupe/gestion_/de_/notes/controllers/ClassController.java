package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.ClassRequest;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.ClassService;
import com.groupe.gestion_.de_.notes.security.Utils.ObjectLevelSecurity;

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
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@Tag(name = "Class Management", description = "API for managing academic classes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClassController {

    private final ClassService classService;
    private final ObjectLevelSecurity objectLevelSecurity;


    @Operation(summary = "Create a new class", description = "Allows Admins to create a new academic class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Class created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or a class with the same name already exists"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can create classes")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody ClassRequest request) {
        ClassResponse response = classService.createClass(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get a class by ID", description = "Retrieve details of a specific class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Class found"),
            @ApiResponse(responseCode = "403", description = "Forbidden: User does not have privileges to view this class"),
            @ApiResponse(responseCode = "404", description = "Class not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('TEACHER') and @securityService.isTeacherAssignedToClass(#id)) or " +
            "(hasRole('STUDENT') and @securityService.isStudentEnrolledInClass(#id))")
    public ResponseEntity<ClassResponse> getClassById(@PathVariable Long id) {
        return classService.getClassById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Class not found with ID: " + id));
    }

    @Operation(summary = "Get all classes", description = "Retrieve a list of all academic classes.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of classes retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can view all classes")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    @Operation(summary = "Get classes assigned to a teacher", description = "Retrieve a list of classes a specific teacher is assigned to.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Classes retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can view other teachers' classes, Teachers can only view their own")
    })
    @GetMapping("/teacher/{teacherIdNum}")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('TEACHER') and @securityService.isTeacherOwner(#teacherId))")
    public ResponseEntity<List<ClassResponse>> getClassesByTeacherIdNum(@PathVariable String teacherIdNum) {
        List<ClassResponse> classes = classService.getClassesByTeacherIdNum(teacherIdNum);
        return ResponseEntity.ok(classes);
    }

    @Operation(summary = "Get classes a student is enrolled in", description = "Retrieve a list of classes a specific student is enrolled in.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Classes retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can view other students' classes, Students can only view their own")
    })
    @GetMapping("/student/{studentIdNum}")
    @PreAuthorize("hasRole('ADMIN') or " +
            "(hasRole('STUDENT') and @securityService.isStudentOwner(#studentId))")
    public ResponseEntity<List<ClassResponse>> getClassesByStudentIdNum(@PathVariable String studentIdNum) {
        List<ClassResponse> classes = classService.getClassesByStudentIdNum(studentIdNum);
        return ResponseEntity.ok(classes);
    }

    @Operation(summary = "Update an existing class", description = "Allows Admins to modify an academic class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Class updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or a class with the same name already exists"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can update classes"),
            @ApiResponse(responseCode = "404", description = "Class not found")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassResponse> updateClass(@PathVariable Long id, @Valid @RequestBody ClassRequest request) {
        ClassResponse updatedClass = classService.updateClass(id, request);
        return ResponseEntity.ok(updatedClass);
    }

    @Operation(summary = "Delete a class by ID", description = "Allows Admins to delete a specific class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Class deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can delete classes"),
            @ApiResponse(responseCode = "404", description = "Class not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
