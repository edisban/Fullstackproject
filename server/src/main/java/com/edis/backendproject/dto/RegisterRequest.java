package com.edis.backendproject.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for user self-registration.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(max = 50, message = "username must be at most 50 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 8, max = 128, message = "password must be between 8 and 128 characters")
    private String password;
}
