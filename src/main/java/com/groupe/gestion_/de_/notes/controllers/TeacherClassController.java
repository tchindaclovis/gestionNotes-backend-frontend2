package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.TeacherClassRequest;
import com.groupe.gestion_.de_.notes.dto.TeacherClassResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.TeacherClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/teacher-classes")
@RequiredArgsConstructor
@Tag(name = "Teacher Class Assignment Management", description = "API for assigning teachers to classes")
public class TeacherClassController {

    private final TeacherClassService teacherClassService;

    /**
     * Assigns a teacher to a class.
     * This operation is restricted to ADMINs only.
     */
    @Operation(summary = "Assign a teacher to a class", description = "Creates a new assignment, linking a teacher to a class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Assignment created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or assignment already exists"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can perform this action"),
            @ApiResponse(responseCode = "404", description = "Teacher or Class not found")
    })
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherClassResponse> assignTeacherToClass(@Valid @RequestBody TeacherClassRequest request) {
        TeacherClassResponse response = teacherClassService.assignTeacherToClass(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Retrieves all classes assigned to a specific teacher.
     * Accessible by ADMINs and the TEACHER who owns the data.
     */
    @Operation(summary = "Get classes by teacher ID", description = "Retrieve all classes assigned to a specific teacher by their unique ID number.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Classes retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient privileges"),
            @ApiResponse(responseCode = "404", description = "Teacher not found")
    })
    @GetMapping("/teacher/{teacherIdNum}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and authentication.name.equals(#teacherIdNum))")
    public ResponseEntity<List<TeacherClassResponse>> getTeacherClassesByTeacherIdNum(@PathVariable String teacherIdNum) {
        List<TeacherClassResponse> classes = teacherClassService.getTeacherClassesByTeacherIdNum(teacherIdNum);
        return ResponseEntity.ok(classes);
    }

    /**
     * Retrieves all teachers assigned to a specific class.
     * Accessible by ADMINs only.
     */
    @Operation(summary = "Get teachers by class ID", description = "Retrieve all teachers assigned to a specific class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Teachers retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can perform this action"),
            @ApiResponse(responseCode = "404", description = "Class not found")
    })
    @GetMapping("/class/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherClassResponse>> getTeachersByClassId(@PathVariable Long classId) {
        List<TeacherClassResponse> teachers = teacherClassService.getTeachersByClassId(classId);
        return ResponseEntity.ok(teachers);
    }

    /**
     * Removes a teacher's assignment from a class.
     * This operation is restricted to ADMINs only.
     */
    @Operation(summary = "Unassign a teacher from a class", description = "Removes an assignment, unlinking a teacher from a class.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Assignment removed successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Only Admins can perform this action"),
            @ApiResponse(responseCode = "404", description = "Assignment not found")
    })
    @DeleteMapping("/unassign/teacher/{teacherIdNum}/class/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unassignTeacherFromClass(@PathVariable String teacherIdNum, @PathVariable Long classId) {
        teacherClassService.unassignTeacherFromClass(teacherIdNum, classId);
        return ResponseEntity.noContent().build();
    }
}
