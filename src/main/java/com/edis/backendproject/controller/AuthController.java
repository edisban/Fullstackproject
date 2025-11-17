package com.edis.backendproject.controller;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.security.AppProperties;
import com.edis.backendproject.security.JwtTokenProvider;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AppProperties appProperties;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          AppProperties appProperties) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.appProperties = appProperties;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            String candidatePassword = appProperties.isUseSha256Passwords()
                ? hashPassword(loginRequest.getPassword())
                : loginRequest.getPassword();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            candidatePassword
                    )
            );

            // Generate JWT token
            String token = tokenProvider.generateToken(authentication);

            // JSON response
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", loginRequest.getUsername());

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        } catch (Exception e) {
            log.error("Error during authentication", e);
            return ResponseEntity.status(500).body("Error during authentication: " + e.getMessage());
        }
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash password", ex);
        }
    }
}
