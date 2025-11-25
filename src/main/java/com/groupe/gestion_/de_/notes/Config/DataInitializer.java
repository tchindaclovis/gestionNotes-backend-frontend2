package com.groupe.gestion_.de_.notes.Config;

import com.groupe.gestion_.de_.notes.model.*;
import com.groupe.gestion_.de_.notes.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeData();
    }

    private void initializeData() {
        // Créer admin seulement s'il n'existe pas
        if (!userRepository.existsByUsername("clovis")) {
            Admin admin = Admin.builder()
                    .username("clovis")
                    .password(passwordEncoder.encode("clovis"))
                    .firstname("Clovis")
                    .lastname("Admin")
                    .email("clovis@example.com")
                    .role(Role.ADMIN)
                    .build();
            adminRepository.save(admin);
        }

        // Créer matières seulement si elles n'existent pas
        if (subjectRepository.count() == 0) {
            Subject math = Subject.builder()
                    .name("Mathématiques")
                    .subjectCode("MATH")
                    .coefficient(3.0)
                    .description("Mathématiques générales")
                    .build();
            subjectRepository.save(math);

            Subject physics = Subject.builder()
                    .name("Physique")
                    .subjectCode("PHYS")
                    .coefficient(2.5)
                    .description("Physique générale")
                    .build();
            subjectRepository.save(physics);
        }

        // Créer étudiant seulement s'il n'existe pas
        if (!userRepository.existsByUsername("student")) {
            Student student = Student.builder()
                    .username("student")
                    .password(passwordEncoder.encode("student"))
                    .firstname("Jean")
                    .lastname("Dupont")
                    .email("student@example.com")
                    .role(Role.STUDENT)
                    .studentIdNum("STU001")
                    .build();
            studentRepository.save(student);
        }

        // Créer professeur seulement s'il n'existe pas
        if (!userRepository.existsByUsername("teacher")) {
            Teacher teacher = Teacher.builder()
                    .username("teacher")
                    .password(passwordEncoder.encode("teacher"))
                    .firstname("Marie")
                    .lastname("Martin")
                    .email("teacher@example.com")
                    .role(Role.TEACHER)
                    .teacherIdNum("TEA001")
                    .build();
            teacherRepository.save(teacher);
        }

        // Créer quelques notes seulement si elles n'existent pas
        if (gradeRepository.count() == 0 && studentRepository.count() > 0 && teacherRepository.count() > 0 && subjectRepository.count() > 0) {
            Student student = studentRepository.findAll().get(0);
            Teacher teacher = teacherRepository.findAll().get(0);
            Subject math = subjectRepository.findBySubjectCode("MATH").orElse(subjectRepository.findAll().get(0));
            Subject physics = subjectRepository.findBySubjectCode("PHYS").orElse(subjectRepository.findAll().get(1));

            Grade grade1 = Grade.builder()
                    .value(15.5)
                    .coefficient(2.0)
                    .date(LocalDate.now().minusDays(10).atStartOfDay())
                    .comment("Bon travail")
                    .student(student)
                    .subject(math)
                    .teacher(teacher)
                    .build();
            gradeRepository.save(grade1);

            Grade grade2 = Grade.builder()
                    .value(12.0)
                    .coefficient(1.5)
                    .date(LocalDate.now().minusDays(5).atStartOfDay())
                    .comment("Peut mieux faire")
                    .student(student)
                    .subject(physics)
                    .teacher(teacher)
                    .build();
            gradeRepository.save(grade2);
        }

        System.out.println("Données de test initialisées avec succès!");
    }
}
