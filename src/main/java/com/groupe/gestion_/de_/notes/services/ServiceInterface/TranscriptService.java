package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import java.io.IOException;

public interface TranscriptService {
    /**
     * Generates an academic transcript in PDF format for a single student.
     * @param studentIdNum The ID of the student.
     * @return A byte array representing the PDF file.
     * @throws IOException if there is an error during PDF generation.
     */
    byte[] generateTranscriptForStudent(String studentIdNum) throws IOException;
}