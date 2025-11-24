package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import java.io.IOException;

public interface ExcelExportService {
    /**
     * Exports all grade records to an Excel file.
     * @return A byte array representing the Excel (.xlsx) file.
     * @throws IOException if there is an error during file generation.
     */
    byte[] exportGradesToExcel() throws IOException;
}
