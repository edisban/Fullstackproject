package com.edis.backendproject.service;

import java.time.Duration;
import java.util.Date;
import java.util.Objects;

import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.edis.backendproject.security.JwtTokenProvider;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Stores revoked JWTs in Redis until they naturally expire so stateless logout works.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private static final String KEY_PREFIX = "auth:blacklist:";

    private final StringRedisTemplate stringRedisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Adds the provided token to the blacklist for the remainder of its lifespan.
     */
    public void blacklistToken(String token) {
        if (!StringUtils.hasText(token)) {
            return;
        }

        long ttlMillis = getRemainingTtlMillis(token);
        if (ttlMillis <= 0) {
            return;
        }

        try {
            stringRedisTemplate.opsForValue()
                    .set(KEY_PREFIX + token, "1", ofMillis(ttlMillis));
        } catch (DataAccessException ex) {
            log.warn("Failed to store blacklisted token", ex);
        }
    }

    /**
     * Checks whether the token was invalidated earlier.
     */
    public boolean isBlacklisted(String token) {
        if (!StringUtils.hasText(token)) {
            return false;
        }
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(KEY_PREFIX + token));
    }

    private long getRemainingTtlMillis(String token) {
        try {
            Date expirationDate = jwtTokenProvider.getExpirationDate(token);
            return expirationDate.getTime() - System.currentTimeMillis();
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("Skip blacklisting invalid token: {}", ex.getMessage());
            return 0;
        }
    }

    private static Duration ofMillis(long millis) {
        return Objects.requireNonNull(Duration.ofMillis(millis));
    }
}
