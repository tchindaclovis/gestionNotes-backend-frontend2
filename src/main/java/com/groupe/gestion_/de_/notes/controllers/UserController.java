package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.*;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Grade Management API", description = " application endpoints !")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService; // Inject UserService

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation ( summary = "endpoint for registering a new studentuser!")
    @PostMapping("/students") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can register a student
    public ResponseEntity<UserResponse> registerStudent(@Valid @RequestBody StudentRequest request) {
        UserResponse response = userService.registerStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation ( summary = "endpoint for registering a new teacheruser!")
    @PostMapping("/teachers") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can register a teacher
    public ResponseEntity<UserResponse> registerTeacher(@Valid @RequestBody TeacherRequest request) {
        UserResponse response = userService.registerTeacher(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation ( summary = "endpoint to perform an Id search!")
    @GetMapping("/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findById(@Valid @PathVariable Long id){
        Optional<UserResponse> optionalresponse = userService.findById(id);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse, HttpStatus.FOUND);
        }else {
            return new ResponseEntity<>(optionalresponse,HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to perform a search base on Username!")
    @GetMapping("/username/{username}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findByUsername(@Valid @PathVariable String username){
        Optional<UserResponse> optionalresponse = userService.findByUsername(username);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse, HttpStatus.FOUND);
        }else {
            return new ResponseEntity<>(optionalresponse, HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to perform a search base on Email!")
    @GetMapping("/email/{email}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findByEmail(@Valid @PathVariable String email){
        Optional<UserResponse> optionalresponse = userService.findByEmail(email);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse,HttpStatus.FOUND);
        }else{
            return new ResponseEntity<>(optionalresponse, HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to get all users!")
    @GetMapping("/users") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        List<UserResponse> listuser = userService.getAllUsers();
        return new ResponseEntity<>(listuser, HttpStatus.OK);
    }
    
    @Operation ( summary = "endpoint to get users for teachers!")
    @GetMapping("/students-list") 
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')") // Teachers can see students
    public ResponseEntity<List<UserResponse>> getStudentsForTeacher(){
        try {
            List<UserResponse> allUsers = userService.getAllUsers();
            logger.info("Total users found: {}", allUsers.size());
            
            // Log des rôles pour diagnostic
            allUsers.forEach(user -> logger.info("User: {}, Role: '{}'", user.getUsername(), user.getRole()));
            
            List<UserResponse> students = allUsers.stream()
                .filter(user -> {
                    String role = user.getRole() != null ? user.getRole().toString() : null;
                    boolean isStudent = role != null && role.trim().equalsIgnoreCase("student");
                    if (isStudent) {
                        logger.info("Found student: {} with role: {}", user.getUsername(), role);
                    }
                    return isStudent;
                })
                .toList();
            
            logger.info("Students filtered: {}", students.size());
            return new ResponseEntity<>(students, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error getting students: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Operation(summary = "Get classes assigned to current teacher")
    @GetMapping("/my-classes")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<String>> getMyClasses(Authentication auth) {
        // TODO: Implémenter la récupération des classes de l'enseignant connecté
        List<String> classes = List.of("3A", "3B", "4A"); // Temporaire
        return ResponseEntity.ok(classes);
    }


    @Operation ( summary = "endpoint to perform an update on user data!")
    @PutMapping("/update/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can update user's information
    public ResponseEntity<UserResponse> updateUser(@Valid @PathVariable Long id, @RequestBody UserRequest request){
        UserResponse userupdated = userService.updateUser(id, request);
        return new ResponseEntity<>(userupdated, HttpStatus.OK);
    }

    @Operation ( summary = "endpoint to perform a delete!")
    @DeleteMapping("/delete/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Void> deleteUserById(@Valid @PathVariable Long id){
        try {
            userService.deleteUserById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting user {}: {}", id, e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Operation(summary = "Upload profile photo")
    @PostMapping("/{id}/photo")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<String> uploadProfilePhoto(
            @PathVariable Long id,
            @RequestParam("photo") MultipartFile photo) {
        try {
            userService.updateProfilePhoto(id, photo);
            return ResponseEntity.ok("Photo mise à jour avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'upload: " + e.getMessage());
        }
    }
    
    @Operation(summary = "Get profile photo")
    @GetMapping("/{id}/photo")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable Long id) {
        try {
            byte[] photo = userService.getProfilePhoto(id);
            String contentType = userService.getPhotoContentType(id);
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType != null ? contentType : "image/jpeg")
                    .body(photo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}