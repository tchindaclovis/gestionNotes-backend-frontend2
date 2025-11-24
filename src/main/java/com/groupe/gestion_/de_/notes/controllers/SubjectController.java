package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.SubjectRequest;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.SubjectService;
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
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Tag(name = "Subject Management", description = "API for managing academic subjects and their details.")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SubjectController {

    private final SubjectService subjectService;

    // --- Create Endpoint ---
    @Operation(summary = "Create a new subject", description = "Allows an Admin to add a new subject to the catalogue.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Subject created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or subject code/name already exists"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can create subjects")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> addSubject(@Valid @RequestBody SubjectRequest request) {
        SubjectResponse response = subjectService.addSubject(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // --- Read Endpoints ---
    @Operation(summary = "Get all subjects", description = "Retrieve a list of all subjects. Accessible to all authenticated users.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of subjects retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Must be authenticated to view subjects")
    })
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        List<SubjectResponse> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @Operation(summary = "Get a subject by ID", description = "Retrieve details of a specific subject by its ID. Accessible to all authenticated users.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subject found"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Must be authenticated"),
            @ApiResponse(responseCode = "404", description = "Subject not found")
    })
    @GetMapping("/{subjectCode}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<SubjectResponse> findBySubjectCode(@PathVariable String subjectCode) {
        return subjectService.findBySubjectCode(subjectCode)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Subject not found with ID: " + subjectCode));
    }


    @Operation(summary = "Get a subject by its unique name", description = "Retrieve details of a specific subject by its unique name. Accessible to all authenticated users.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subject found"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Must be authenticated"),
            @ApiResponse(responseCode = "404", description = "Subject not found")
    })
    @GetMapping("/name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<SubjectResponse> findBySubject_Name(@PathVariable String name) {
        return subjectService.findBySubject_Name(name)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Subject not found with name: " + name));
    }

    // --- Update Endpoint ---
    @Operation(summary = "Update an existing subject", description = "Allows an Admin to modify an existing subject's details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Subject updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or updated subject code/name already exists"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can update subjects"),
            @ApiResponse(responseCode = "404", description = "Subject not found")
    })
    @PutMapping("/{subjectCode}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponse> updateSubject(@PathVariable String subjectCode, @Valid @RequestBody SubjectRequest request) {
        SubjectResponse updatedSubject = subjectService.updateSubject(subjectCode, request);
        return ResponseEntity.ok(updatedSubject);
    }

    // --- Delete Endpoint ---
    @Operation(summary = "Delete a subject by ID", description = "Allows an Admin to remove a subject from the catalogue.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Subject deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can delete subjects"),
            @ApiResponse(responseCode = "404", description = "Subject not found")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
