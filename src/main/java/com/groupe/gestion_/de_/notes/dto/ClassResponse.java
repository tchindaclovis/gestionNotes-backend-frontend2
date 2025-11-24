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
public class ClassResponse {
    private Long id;
    private String academicYear;
    private String name;
}
