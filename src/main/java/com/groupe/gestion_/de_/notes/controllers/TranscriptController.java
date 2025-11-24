package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.services.ServiceInterface.TranscriptService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/transcripts")
@RequiredArgsConstructor
@Tag(name = "Transcript Management", description = "API for generating official student transcripts in PDF format.")
@CrossOrigin(origins = "http://localhost:4200")
public class TranscriptController {

    private final TranscriptService transcriptService;

    @Operation(summary = "Generate a PDF transcript for a student")
    @GetMapping("/student/{studentIdNum}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<byte[]> getStudentTranscript(@PathVariable String studentIdNum) {
        try {
            byte[] pdfBytes = transcriptService.generateTranscriptForStudent(studentIdNum);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "transcript_" + studentIdNum + ".pdf");
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
