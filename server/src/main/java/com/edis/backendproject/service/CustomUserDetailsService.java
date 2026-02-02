package com.edis.backendproject.service;

import java.util.Collections;
import java.util.Objects;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.Nullable;

import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Loads user details from database for Spring Security authentication.
 * Used by AuthenticationManager during login validation.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(@Nullable String username) throws UsernameNotFoundException {
        String safeUsername = Objects.requireNonNull(username, "username is required");

        User user = userRepository.findByUsername(safeUsername)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + safeUsername));

        return Objects.requireNonNull(org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.emptyList()) 
                .build());
    }
}
