package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Builder
public class SubjectRequest {
    @NotBlank
    private String subjectCode;
    @NotBlank
    private String name;
    @NotBlank
    private Double coefficient;
    @NotBlank
    private String description;

}
