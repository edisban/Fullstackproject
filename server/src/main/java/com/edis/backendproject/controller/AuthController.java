package com.edis.backendproject.controller;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.dto.LoginRequest;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.security.JwtTokenProvider;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> loginJson(@Valid @RequestBody LoginRequest loginRequest) {
        return authenticate(loginRequest);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> loginForm(@Valid LoginRequest loginRequest) {
        return authenticate(loginRequest);
    }

    private ResponseEntity<ApiResponse<Map<String, String>>> authenticate(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String token = tokenProvider.generateToken(authentication);

            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            data.put("username", loginRequest.getUsername());

            log.info("User {} authenticated successfully", loginRequest.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Login successful", data));
        } catch (AuthenticationException ex) {
            log.warn("Failed login attempt for {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        } catch (Exception ex) {
            log.error("Unexpected login error for {}", loginRequest.getUsername(), ex);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Unexpected error occurred"));
        }
    }
}
