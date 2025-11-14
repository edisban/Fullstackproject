package com.edis.backendproject.controller;

import java.time.LocalDate;

public class TaskRequest {
    private String codeNumber;      // ΑΦΜ
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Long projectId;         // Σε ποιο project ανήκει

    // Constructor
    public TaskRequest() {}

    // Getters and Setters
    public String getCodeNumber() { return codeNumber; }
    public void setCodeNumber(String codeNumber) { this.codeNumber = codeNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
}
