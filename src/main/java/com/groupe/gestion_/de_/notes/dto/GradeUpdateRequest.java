package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Builder
public class GradeUpdateRequest {
    @Min(0)
    private Double value;
    private String comment;
}