package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ClassSubjectResponse {
    private Long id;
    private ClassResponse classEntity; // Nested DTO for class details
    private SubjectResponse subject; // Nested DTO for subject details
}