package com.edis.backendproject.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.NonNull;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Centralizes Redis connectivity and serialization so the app can reuse RedisTemplate
 * wherever caching or ephemeral storage is needed.
 */
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public @NonNull LettuceConnectionFactory redisConnectionFactory(
            @Value("${spring.data.redis.host}") @NonNull String host,
            @Value("${spring.data.redis.port}") int port,
            @Value("${spring.data.redis.password:}") String password,
            @Value("${spring.data.redis.ssl.enabled:false}") boolean sslEnabled,
            @Value("${spring.data.redis.timeout:PT5S}") @NonNull Duration commandTimeout) {

        String safeHost = Objects.requireNonNull(host, "spring.data.redis.host is required");
        Duration safeTimeout = Objects.requireNonNull(commandTimeout, "spring.data.redis.timeout is required");

        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(safeHost, port);
        if (StringUtils.hasText(password)) {
            configuration.setPassword(password);
        }

        LettuceClientConfiguration.LettuceClientConfigurationBuilder builder = LettuceClientConfiguration.builder()
            .commandTimeout(safeTimeout)
            .shutdownTimeout(seconds(2));
        if (sslEnabled) {
            builder.useSsl();
        }

        return new LettuceConnectionFactory(configuration, builder.build());
    }

    @Bean
    public @NonNull RedisTemplate<String, Object> redisTemplate(
            @NonNull LettuceConnectionFactory connectionFactory) {
        LettuceConnectionFactory safeConnectionFactory = Objects.requireNonNull(connectionFactory, "LettuceConnectionFactory is required");
        RedisSerializer<Object> serializer = jsonSerializer();
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(safeConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public @NonNull StringRedisTemplate stringRedisTemplate(@NonNull LettuceConnectionFactory connectionFactory) {
        return new StringRedisTemplate(Objects.requireNonNull(connectionFactory, "LettuceConnectionFactory is required"));
    }

    @Bean
    public @NonNull RedisCacheManager redisCacheManager(@NonNull LettuceConnectionFactory connectionFactory) {
        LettuceConnectionFactory safeConnectionFactory = Objects.requireNonNull(connectionFactory, "LettuceConnectionFactory is required");
        RedisSerializer<Object> serializer = jsonSerializer();
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                .prefixCacheNameWith("cache::")
                .entryTtl(minutes(5));

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        cacheConfigurations.put(CacheNames.PROJECTS, defaultConfig.entryTtl(minutes(10)));
        cacheConfigurations.put(CacheNames.STUDENTS, defaultConfig.entryTtl(minutes(5)));
        cacheConfigurations.put(CacheNames.METADATA, defaultConfig.entryTtl(hours(1)));

        return RedisCacheManager.builder(safeConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }

    private static @NonNull Duration minutes(long minutes) {
        return Objects.requireNonNull(Duration.ofMinutes(minutes));
    }

    private static @NonNull Duration hours(long hours) {
        return Objects.requireNonNull(Duration.ofHours(hours));
    }

    private static @NonNull Duration seconds(long seconds) {
        return Objects.requireNonNull(Duration.ofSeconds(seconds));
    }

    private static @NonNull RedisSerializer<Object> jsonSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }
}
