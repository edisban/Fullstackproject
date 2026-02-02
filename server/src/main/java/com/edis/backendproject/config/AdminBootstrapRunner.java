package com.edis.backendproject.config;

import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Ensures an admin user exists using credentials supplied via environment variables.
 * Avoids shipping hard-coded passwords in database dumps by seeding at runtime instead.
 */
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    @Value("${app.admin.username:}")
    private String adminUsername;

    @Value("${app.admin.password:}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(adminUsername) || !StringUtils.hasText(adminPassword)) {
            log.warn("Admin bootstrap skipped: app.admin.username/password must be set");
            return;
        }

        userRepository.findByUsername(adminUsername)
            .ifPresentOrElse(existing -> {
                if (!passwordEncoder.matches(adminPassword, existing.getPassword())) {
                    existing.setPassword(passwordEncoder.encode(adminPassword));
                    userRepository.save(existing);
                    log.info("Admin '{}' password updated from environment settings", adminUsername);
                } else {
                    log.debug("Admin '{}' already present with matching password", adminUsername);
                }
            }, () -> {
                User admin = Objects.requireNonNull(
                        User.builder()
                                .username(adminUsername)
                                .password(passwordEncoder.encode(adminPassword))
                                .role("ADMIN")
                                .build()
                );
                userRepository.save(admin);
                log.info("Admin '{}' seeded from environment settings", adminUsername);
            });
    }
}
