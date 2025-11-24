package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRecordResponse {
    private Long id;
    private LocalDateTime logIn;
    private LocalDateTime logOut;
    private UserResponse user; // Nested UserResponse DTO for user details
    private String ipAddress;


    public LoginRecordResponse(Long id, UserResponse user, LocalDateTime logIn, LocalDateTime logOut, String ipAddress) {
        this.id = id;
        this.user = user;
        this.logIn = logIn;
        this.logOut = logOut;
        this.ipAddress = ipAddress;
    }
}