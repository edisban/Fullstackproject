package com.edis.backendproject.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @JsonAlias({"am"})
    @NotBlank(message = "codeNumber is required")
    @Size(max = 20, message = "codeNumber must be at most 20 characters")
    @Pattern(regexp = "^[0-9]+$", message = "Student ID must contain only numbers")
    private String codeNumber;

    @NotBlank(message = "firstName is required")
    @Size(max = 100, message = "firstName must be at most 100 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "First name must contain only letters")
    private String firstName;

    @NotBlank(message = "lastName is required")
    @Size(max = 100, message = "lastName must be at most 100 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Last name must contain only letters")
    private String lastName;

    @Past(message = "dateOfBirth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "title is required")
    @Size(max = 200, message = "title must be at most 200 characters")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Job title must contain only letters")
    private String title;

    @Size(max = 1000, message = "description must be at most 1000 characters")
    private String description;

    @NotNull(message = "projectId is required")
    private Long projectId;
}