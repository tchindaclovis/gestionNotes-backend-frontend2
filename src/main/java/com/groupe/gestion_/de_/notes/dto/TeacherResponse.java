package com.groupe.gestion_.de_.notes.dto;

import com.groupe.gestion_.de_.notes.model.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder

public class TeacherResponse extends UserResponse {
    private String teacherIdNum;

    // constructor
    public TeacherResponse(Long id, String username, String firstname, String lastname, String email, Role role, String teacherIdNum) {
        super(id, username, firstname, lastname, email, role);
        this.teacherIdNum = teacherIdNum;
    }
}
