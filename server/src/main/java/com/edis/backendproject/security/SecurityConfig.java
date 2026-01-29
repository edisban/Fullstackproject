package com.edis.backendproject.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.edis.backendproject.service.CustomUserDetailsService;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final List<String> allowedOrigins;

    public SecurityConfig(@Value("${app.cors.allowed-origins}") String allowedOriginsProperty) {
        this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(
            JwtTokenProvider tokenProvider,
            CustomUserDetailsService customUserDetailsService) {
        return new JwtAuthenticationFilter(tokenProvider, customUserDetailsService);
    }

 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = allowedOrigins.isEmpty()
            ? Arrays.asList(
                "http://localhost:5176",
                "http://127.0.0.1:5176",
                "http://localhost",
                "http://127.0.0.1"
            )
            : allowedOrigins;
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http,
            CustomUserDetailsService customUserDetailsService,
            PasswordEncoder passwordEncoder) throws Exception {

        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder);
        return authBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Sha256PasswordEncoder();
    }
}