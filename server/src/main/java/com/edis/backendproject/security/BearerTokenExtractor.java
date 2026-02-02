package com.edis.backendproject.security;

import java.util.Optional;

import org.springframework.util.StringUtils;

/**
 * Extracts the raw JWT value from a standard Authorization header.
 */
public final class BearerTokenExtractor {

    private static final String BEARER_PREFIX = "Bearer ";

    private BearerTokenExtractor() {
    }

    @SuppressWarnings("null")
    public static Optional<String> extract(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith(BEARER_PREFIX)) {
            return Optional.empty();
        }
        String tokenValue = authorizationHeader.substring(BEARER_PREFIX.length()).trim();
        return Optional.of(tokenValue);
    }
}
