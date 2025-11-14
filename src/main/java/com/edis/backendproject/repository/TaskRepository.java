package com.edis.backendproject.repository;

import com.edis.backendproject.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Tasks ενός project
    List<Task> findByProjectId(Long projectId);

    // Αναζήτηση με ΑΦΜ
    Optional<Task> findByCodeNumber(String codeNumber);

    // Αναζήτηση με όνομα ή επώνυμο
    List<Task> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}