package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailRequest {
    @NotBlank(message = "Recipient email is mandatory")
    @Email(message = "Recipient email should be a valid email address")
    private String to;

    @NotBlank(message = "Subject is mandatory")
    private String subject;

    @NotBlank(message = "Body is mandatory")
    private String body;
}
