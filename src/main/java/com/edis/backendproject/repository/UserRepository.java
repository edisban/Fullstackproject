package com.edis.backendproject.repository;

import com.edis.backendproject.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 🔍 Αναζήτηση χρήστη με βάση το username
    Optional<User> findByUsername(String username);
}
