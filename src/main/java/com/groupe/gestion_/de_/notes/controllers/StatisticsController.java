package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import com.groupe.gestion_.de_.notes.model.Role;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Statistics", description = "API for dashboard statistics")
public class StatisticsController {

    private final UserService userService;
    private final SubjectService subjectService;
    private final GradeService gradeService;
    private final ClassService classService;

    @Operation(summary = "Get dashboard statistics")
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les utilisateurs par rôle
        long totalStudents = userService.getAllUsers().stream()
            .filter(user -> Role.STUDENT.equals(user.getRole()))
            .count();
            
        long totalTeachers = userService.getAllUsers().stream()
            .filter(user -> Role.TEACHER.equals(user.getRole()))
            .count();
            
        long totalSubjects = subjectService.getAllSubjects().size();
        long totalClasses = classService.getAllClasses().size();
        
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("totalSubjects", totalSubjects);
        stats.put("totalClasses", totalClasses);
        stats.put("totalUsers", userService.getAllUsers().size());
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get grade statistics")
    @GetMapping("/grades")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getGradeStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Calculer les moyennes générales
        Double globalAverage = gradeService.calculateGlobalAverage();
        Long totalGrades = gradeService.getTotalGradesCount();
        
        stats.put("globalAverage", globalAverage != null ? globalAverage : 0.0);
        stats.put("totalGrades", totalGrades != null ? totalGrades : 0);
        
        return ResponseEntity.ok(stats);
    }

    @Operation(summary = "Get student performance statistics")
    @GetMapping("/performance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getPerformanceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Calculer les taux de réussite
        long studentsAbove10 = gradeService.getStudentsAboveAverage(10.0);
        long totalStudentsWithGrades = gradeService.getStudentsWithGrades();
        
        double successRate = totalStudentsWithGrades > 0 ? 
            (double) studentsAbove10 / totalStudentsWithGrades * 100 : 0.0;
            
        stats.put("successRate", Math.round(successRate * 100.0) / 100.0);
        stats.put("studentsAbove10", studentsAbove10);
        stats.put("totalStudentsWithGrades", totalStudentsWithGrades);
        
        return ResponseEntity.ok(stats);
    }
}