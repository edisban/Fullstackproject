package com.edis.backendproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Ensures there is always at least one administrative user in the system.
 * Credentials are configurable via environment variables to keep secrets out of the codebase.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        userRepository.findByUsername(adminUsername)
                .ifPresentOrElse(
                        existing -> log.info("Admin user '{}' already exists", adminUsername),
                        this::createDefaultAdmin
                );
    }

    private void createDefaultAdmin() {
        User admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .role("ADMIN")
                .build();
        userRepository.save(admin);
        log.info("Default admin user '{}' created", adminUsername);
    }
}
