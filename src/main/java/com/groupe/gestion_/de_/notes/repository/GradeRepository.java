package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {

    // Trouver toutes les notes d'un étudiant
    List<Grade> findByStudentId(Long studentId);

    // Trouver toutes les notes d'une matière
    List<Grade> findBySubjectId(Long subjectId);

    // Trouver toutes les notes saisies par un enseignant
    List<Grade> findByTeacherId(Long teacherId);

    // Trouver les notes d'un étudiant pour une matière
    List<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    // Calculer la moyenne d'un étudiant pour une matière
    @Query("SELECT AVG(g.value) FROM Grade g WHERE g.student.id = :studentId AND g.subject.id = :subjectId")
    Double findAverageByStudentAndSubject(@Param("studentId") Long studentId, @Param("subjectId") Long subjectId);

    // Calculer la moyenne générale d'un étudiant
    @Query("SELECT AVG(g.value * g.coefficient) / AVG(g.coefficient) FROM Grade g WHERE g.student.id = :studentId")
    Double findWeightedAverageByStudent(@Param("studentId") Long studentId);

    // Calculer la moyenne globale de tous les étudiants
    @Query("SELECT AVG(g.value) FROM Grade g")
    Double findGlobalAverage();

    // Compter les étudiants ayant une moyenne supérieure à un seuil
    @Query("SELECT COUNT(DISTINCT g.student.id) FROM Grade g GROUP BY g.student.id HAVING AVG(g.value) > :threshold")
    Long countStudentsAboveAverage(@Param("threshold") Double threshold);

    // Compter le nombre d'étudiants distincts ayant des notes
    @Query("SELECT COUNT(DISTINCT g.student.id) FROM Grade g")
    Long countDistinctStudents();
}