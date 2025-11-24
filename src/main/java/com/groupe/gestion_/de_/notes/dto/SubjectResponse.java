package com.groupe.gestion_.de_.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@Builder

public class SubjectResponse {
    private Long id;
    private String subjectCode;
    private String name;
    private Double coefficient;
    private String description;
}
