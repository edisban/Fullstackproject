package com.edis.backendproject.controller;

import java.util.Objects;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.security.BearerTokenExtractor;
import com.edis.backendproject.service.TokenBlacklistService;
import com.edis.backendproject.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Authenticated user-facing endpoints (profile management, etc.).
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TokenBlacklistService tokenBlacklistService;

    @SuppressWarnings("null")
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteCurrentUser(
            Authentication authentication,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader) {
        String username = Objects.requireNonNull(authentication, "Authentication must not be null").getName();
        userService.deleteUserByUsername(username);
        BearerTokenExtractor.extract(authorizationHeader)
                .ifPresent(tokenBlacklistService::blacklistToken);
        log.info("User {} deleted their account", username);
        return ResponseEntity.ok(ApiResponse.success("Your account was deleted successfully.", null));
    }
}
