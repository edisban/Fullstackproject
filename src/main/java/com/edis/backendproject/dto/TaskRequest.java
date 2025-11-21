package com.edis.backendproject.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @JsonAlias({"am"})
    @NotBlank(message = "codeNumber is required")
    @Size(max = 20, message = "codeNumber must be at most 20 characters")
    private String codeNumber;

    @NotBlank(message = "firstName is required")
    @Size(max = 100, message = "firstName must be at most 100 characters")
    private String firstName;

    @NotBlank(message = "lastName is required")
    @Size(max = 100, message = "lastName must be at most 100 characters")
    private String lastName;

    @Past(message = "dateOfBirth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "title is required")
    @Size(max = 200, message = "title must be at most 200 characters")
    private String title;

    private String description;

    @NotBlank(message = "status is required")
    @Size(max = 50, message = "status must be at most 50 characters")
    private String status;

    @NotNull(message = "projectId is required")
    private Long projectId;
}
