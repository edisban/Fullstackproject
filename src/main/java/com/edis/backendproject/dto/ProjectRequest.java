package com.edis.backendproject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * DTO για λήψη δεδομένων κατά τη δημιουργία ή ενημέρωση ενός Project.
 * Περιέχει μόνο τα πεδία που επιτρέπεται να στείλει ο χρήστης από το frontend.
 */
public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(max = 100, message = "Project name cannot exceed 100 characters")
    private String name;

    private String description;
    private LocalDate startDate;

    // Κενός constructor (απαραίτητος για το JSON deserialization)
    public ProjectRequest() {}

    public ProjectRequest(String name, String description, LocalDate startDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
    }

    // Getters / Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
}
