package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {
    
    @NotNull(message = "La note est requise")
    @DecimalMin(value = "0.0", message = "La note doit être supérieure ou égale à 0")
    @DecimalMax(value = "20.0", message = "La note doit être inférieure ou égale à 20")
    private Double value;
    
    @NotNull(message = "Le coefficient est requis")
    @DecimalMin(value = "0.5", message = "Le coefficient doit être supérieur ou égal à 0.5")
    @DecimalMax(value = "5.0", message = "Le coefficient doit être inférieur ou égal à 5")
    private Double coefficient;
    
    @Size(max = 500, message = "Le commentaire ne peut pas dépasser 500 caractères")
    private String comment;
    
    private LocalDateTime date;
    
    @NotNull(message = "L'ID de l'étudiant est requis")
    private Long studentId;
    
    @NotNull(message = "L'ID de la matière est requis")
    private Long subjectId;
    
    @NotNull(message = "L'ID de l'enseignant est requis")
    private Long teacherId;
}