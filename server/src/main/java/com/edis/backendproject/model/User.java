package com.edis.backendproject.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * User entity for authentication. Username is unique.
 * Default admin user is auto-created on first startup.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    private String role = "USER";

    @PrePersist
    @PreUpdate
    public void ensureRole() {
        if (role == null || role.isBlank()) {
            role = "USER";
        }
    }
}