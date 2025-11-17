package com.edis.backendproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edis.backendproject.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Tasks ενός project
    List<Task> findByProjectId(Long projectId);

    // Αναζήτηση με ΑΦΜ
    Optional<Task> findByCodeNumber(String codeNumber);

    // Αναζήτηση με όνομα ή επώνυμο
    List<Task> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}