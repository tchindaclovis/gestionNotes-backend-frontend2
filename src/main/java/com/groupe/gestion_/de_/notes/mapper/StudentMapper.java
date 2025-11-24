package com.groupe.gestion_.de_.notes.mapper;

import com.groupe.gestion_.de_.notes.dto.StudentResponse;
import com.groupe.gestion_.de_.notes.model.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring") // componentModel="spring" if you use Spring
public interface StudentMapper {

    StudentMapper INSTANCE = Mappers.getMapper(StudentMapper.class);
    StudentResponse toStudentResponse(Student student);
}
