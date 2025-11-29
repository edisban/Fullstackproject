package com.edis.backendproject.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * User entity for authentication. Username is unique.
 * Default admin user is auto-created on first startup.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
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