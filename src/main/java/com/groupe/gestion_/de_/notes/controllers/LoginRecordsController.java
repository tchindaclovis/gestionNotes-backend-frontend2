package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.LoginRecordResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.LoginRecordsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/audit/login-records")
@RequiredArgsConstructor
@Tag(name = "Login Records", description = "API for viewing user login history. For auditing purposes.")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginRecordsController {

    private final LoginRecordsService loginRecordsService;


    @Operation(summary = "Get all login records", description = "Retrieves the full login history for all users. Only for Admin use.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login records retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can access this resource")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoginRecordResponse>> getAllLoginRecords() {
        return ResponseEntity.ok(loginRecordsService.getAllLoginRecords());
    }

    @Operation(summary = "Get login records for a specific user", description = "Retrieves the login history for a single user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login records retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins or Teachers (for their students) can access"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')") // For simplicity, only Admins can view other users' records for now.
    public ResponseEntity<List<LoginRecordResponse>> getLoginRecordsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(loginRecordsService.getLoginRecordsByUser_Id(userId));
    }

    @Operation(summary = "Get a specific login record by ID", description = "Retrieves a single login record.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login record found"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can access"),
            @ApiResponse(responseCode = "404", description = "Login record not found")
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoginRecordResponse> getLoginRecordById(@PathVariable Long id) {
        return loginRecordsService.getLoginRecordById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoSuchElementException("Login record not found with ID: " + id));
    }
}
