package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Builder
public class ClassRequest {
    @NotBlank
    private String academicYear;
    @NotBlank
    private String name;
}
