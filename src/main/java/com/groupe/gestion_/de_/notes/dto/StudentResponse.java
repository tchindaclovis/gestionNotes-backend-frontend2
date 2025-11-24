package com.groupe.gestion_.de_.notes.dto;

import com.groupe.gestion_.de_.notes.model.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Builder
public class StudentResponse extends UserResponse {
    private String studentIdNum;

    // constructor
    public StudentResponse(Long id, String username, String firstname, String lastname, String email, Role role, String studentIdNum) {
        super(id, username, firstname, lastname, email, role);
        this.studentIdNum = studentIdNum;
    }
}