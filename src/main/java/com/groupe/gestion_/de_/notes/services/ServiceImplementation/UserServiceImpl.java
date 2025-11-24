package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.dto.*;
import com.groupe.gestion_.de_.notes.model.*;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import com.groupe.gestion_.de_.notes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor // Lombok annotation for constructor injection
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injected from security config



    public StudentResponse registerStudent(StudentRequest request) {
        // Validate username/email existence (common logic)
        validateNewUserUniqueness(request.getUsername(), request.getEmail());

        // Create base User entity part
        Student student =  Student.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(Role.STUDENT) // Set the specific role here
                .build();

        // Apply specific fields for Student
        student.setStudentIdNum(request.getStudentIdNum()); // This comes from the subclass DTO

        // Save the specific subclass entity (Spring Data JPA will handle persistence based on inheritance)
        Student savedStudent = userRepository.save(student); // Assuming userRepository is a JpaRepository<User, Long>
        return mapUserToStudentResponse(savedStudent);
    }

    public TeacherResponse registerTeacher(TeacherRequest request) {
        validateNewUserUniqueness(request.getUsername(), request.getEmail());

        Teacher teacher = Teacher.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(Role.TEACHER) // Set the specific role here
                .build();

        teacher.setTeacherIdNum(request.getTeacherIdNum()); // Set teacher specific field

        User savedTeacher = userRepository.save(teacher);
        return mapUserToTeacherResponse((Teacher) savedTeacher);
    }


    // Helper for common validation
    private void validateNewUserUniqueness(String username, String email) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }
    }

    // Helper for mapping User entity to UserResponse DTO

    private StudentResponse mapUserToStudentResponse(Student student){
        return new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getFirstname(),
                student.getLastname(),
                student.getEmail(),
                student.getRole(),
                student.getStudentIdNum()
        );
    }

    private TeacherResponse mapUserToTeacherResponse(Teacher teacher) {
        return new TeacherResponse(
                teacher.getId(),
                teacher.getUsername(),
                teacher.getFirstname(),
                teacher.getLastname(),
                teacher.getEmail(),
                teacher.getRole(),
                teacher.getTeacherIdNum()
        );
    }
//-----------------------------------------------------------------------------------------------------


    @Transactional(readOnly = true) // Read-only for performance optimization
    public Optional <UserResponse> findById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else{
            throw new NoSuchElementException("User not found with id: " + id);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponse> findByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else {
            throw new NoSuchElementException(" No User found with Username: " + username);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponse> findByEmail( String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else {
            throw new NoSuchElementException("No User found with the Email: " + email );
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User concernedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields only if provided in the request
        if (request.getUsername() != null && !request.getUsername().equals(concernedUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already taken: " + request.getUsername());
            }
            concernedUser.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().equals(concernedUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use: " + request.getEmail());
            }
            concernedUser.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            concernedUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getFirstname() != null) {
            concernedUser.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            concernedUser.setLastname(request.getLastname());
        }

        User updatedUser = userRepository.save(concernedUser);
        return mapToResponse(updatedUser);
    }

    @Transactional
    @Override
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // --- Helper method for mapping ---
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getRole()
                );
    }
    
    // --- Méthodes pour la gestion des photos ---
    @Override
    @Transactional
    public void updateProfilePhoto(Long userId, MultipartFile photo) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Validation du fichier
        if (photo.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }
        
        // Validation du type MIME
        String contentType = photo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }
        
        // Validation de la taille (max 5MB)
        if (photo.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("La taille du fichier ne peut pas dépasser 5MB");
        }
        
        user.setProfilePhoto(photo.getBytes());
        user.setPhotoContentType(contentType);
        userRepository.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public byte[] getProfilePhoto(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (user.getProfilePhoto() == null) {
            throw new RuntimeException("Aucune photo de profil trouvée pour cet utilisateur");
        }
        
        return user.getProfilePhoto();
    }
    
    @Override
    @Transactional(readOnly = true)
    public String getPhotoContentType(Long userId) {
        return userRepository.findById(userId)
                .map(User::getPhotoContentType)
                .orElse("image/jpeg");
    }
}