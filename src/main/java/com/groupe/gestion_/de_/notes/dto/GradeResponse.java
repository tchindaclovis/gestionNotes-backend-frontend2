package com.groupe.gestion_.de_.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long id;
    private Double value;
    private Double coefficient;
    private String comment;
    private LocalDateTime date;
    private Long studentId;
    private String studentName;
    private Long subjectId;
    private String subjectName;
    private Long teacherId;
    private String teacherName;
    private LocalDateTime createdAt;
}