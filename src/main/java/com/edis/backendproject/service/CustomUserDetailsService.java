package com.edis.backendproject.service;

import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;
import com.edis.backendproject.security.AppProperties;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AppProperties appProperties;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(UserRepository userRepository, 
                                   AppProperties appProperties,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.appProperties = appProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        ensureDefaultAdmin();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.emptyList()) 
                .build();
    }

    @Transactional
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
        admin.setPassword(passwordEncoder.encode(rawPassword));
        admin.setRole("ADMIN");

        userRepository.save(admin);
    }
}
