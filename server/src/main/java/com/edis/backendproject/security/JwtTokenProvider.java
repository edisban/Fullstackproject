package com.edis.backendproject.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

/**
 * Handles JWT token creation, validation, and parsing.
 * Tokens contain username and expiration, signed with HS256 algorithm.
 */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    private Key getSigningKey() {
        String secret = Objects.requireNonNull(jwtProperties.getSecret(), "JWT secret must not be null");
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            keyBytes = Arrays.copyOf(keyBytes, 32);
        }
        return Objects.requireNonNull(Keys.hmacShaKeyFor(keyBytes));
    }


    public String generateToken(Authentication authentication) {
        String username = Objects.requireNonNull(authentication.getName(), "Authentication principal must have a username");
        Date now = Objects.requireNonNull(new Date());
        Date expiryDate = Objects.requireNonNull(new Date(now.getTime() + jwtProperties.getExpiration()));

        return Objects.requireNonNull(Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact());
    }

    public String getUsernameFromToken(String token) {
        Claims claims = parseClaims(token);
        return Objects.requireNonNull(claims.getSubject(), "JWT subject missing");
    }

    public Date getExpirationDate(String token) {
        Claims claims = parseClaims(token);
        return Objects.requireNonNull(claims.getExpiration(), "JWT expiration missing");
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
            .parseClaimsJws(token)
            .getBody();
        return Objects.requireNonNull(claims);
    }
}