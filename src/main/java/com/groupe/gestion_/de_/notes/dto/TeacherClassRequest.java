package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
@Builder
public class TeacherClassRequest {
    @NotNull(message = "Teacher ID cannot be null")
    @Positive(message = "Teacher IdNum must be positive")
    private String teacherIdNum;

    @NotNull(message = "Class ID cannot be null")
    @Positive(message = "Class ID must be positive")
    private Long classId;
}
