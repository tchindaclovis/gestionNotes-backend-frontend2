package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.TeacherClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherClassRepository extends JpaRepository<TeacherClass, Long> {
    Optional<TeacherClass> findByTeacher_TeacherIdNumAndClassEntity_Id(String teacherIdNum, Long classId);
    List<TeacherClass> findByTeacher_TeacherIdNum(String teacherIdNum);
    List<TeacherClass> findByClassEntity_Id(Long classId);
    boolean existsByTeacher_TeacherIdNumAndClassEntity_Id(String teacherIdNum, Long classId);
}
