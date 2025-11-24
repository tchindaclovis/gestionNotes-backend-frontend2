package com.groupe.gestion_.de_.notes.dto;

import com.groupe.gestion_.de_.notes.model.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Builder

public class UserResponse {
    private Long id;
    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private Role role;

    // constructor
    public UserResponse(Long id, String username, String firstname, String lastname, String email, Role role) {
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.role = role;
    }
}