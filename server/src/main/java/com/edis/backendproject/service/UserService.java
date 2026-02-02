package com.edis.backendproject.service;

import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edis.backendproject.dto.RegisterRequest;
import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

/**
 * Handles user lifecycle operations such as self-registration.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Registers a new end-user with a BCrypt-hashed password.
     *
     * @throws IllegalArgumentException when the username is already taken.
     */
    @SuppressWarnings("null")
    @Transactional
    public User registerUser(RegisterRequest request) {
        Objects.requireNonNull(request, "Register request must not be null");

        String normalizedUsername = Objects.requireNonNull(request.getUsername(), "Username is required").trim();
        if (normalizedUsername.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Username is already taken");
        }

        String rawPassword = Objects.requireNonNull(request.getPassword(), "Password is required");
        String hashedPassword = passwordEncoder.encode(rawPassword);

        User user = User.builder()
                .username(normalizedUsername)
                .password(hashedPassword)
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);
        return Objects.requireNonNull(savedUser);
    }

    /**
     * Removes the user identified by the provided username.
     *
     * @throws EntityNotFoundException when the username does not exist.
     */
    @SuppressWarnings("null")
    @Transactional
    public void deleteUserByUsername(String username) {
        String normalizedUsername = Objects.requireNonNull(username, "Username is required").trim();
        if (normalizedUsername.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }

        User existing = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        userRepository.delete(existing);
    }
}
