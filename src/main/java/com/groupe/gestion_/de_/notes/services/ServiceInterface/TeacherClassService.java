package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.TeacherClassRequest;
import com.groupe.gestion_.de_.notes.dto.TeacherClassResponse;

import java.util.List;

public interface TeacherClassService {
    TeacherClassResponse assignTeacherToClass(TeacherClassRequest request);
    List<TeacherClassResponse> getTeacherClassesByTeacherIdNum(String teacherIdNum);
    List<TeacherClassResponse> getTeachersByClassId(Long classId);
    void unassignTeacherFromClass(String teacherIdNum, Long classId);
}