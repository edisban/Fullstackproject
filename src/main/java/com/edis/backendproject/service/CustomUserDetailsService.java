package com.edis.backendproject.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;
import com.edis.backendproject.security.AppProperties;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AppProperties appProperties;

    public CustomUserDetailsService(UserRepository userRepository, AppProperties appProperties) {
        this.userRepository = userRepository;
        this.appProperties = appProperties;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ensureDefaultAdmin();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.emptyList()) // χωρίς ρόλους για απλότητα
                .build();
    }

    private void ensureDefaultAdmin() {
        String username = Optional.ofNullable(appProperties.getDefaultAdminUsername())
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .orElse(null);

        if (username == null || userRepository.findByUsername(username).isPresent()) {
            return;
        }

        String rawPassword = Optional.ofNullable(appProperties.getDefaultAdminPassword())
                .filter(value -> !value.isBlank())
                .orElse("123456");

        User admin = new User();
        admin.setUsername(username);
        admin.setPassword(appProperties.isUseSha256Passwords()
                ? hashPassword(rawPassword)
                : rawPassword);
        admin.setRole("ADMIN");

        userRepository.save(admin);
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
