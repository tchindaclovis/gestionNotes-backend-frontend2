package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {

    @NotNull(message = "Student ID is mandatory")
    private String studentIdNum;

    @NotNull(message = "Class ID is mandatory")
    private Long classId;

    @NotNull(message = "Subject ID is mandatory")
    private String subjectCode;
}
