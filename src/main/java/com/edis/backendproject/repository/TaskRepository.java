package com.edis.backendproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edis.backendproject.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Tasks ενός project
    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectIdAndProjectOwnerUsername(Long projectId, String username);

    List<Task> findByProjectOwnerUsername(String username);

    Optional<Task> findByIdAndProjectOwnerUsername(Long id, String username);

    // Αναζήτηση με ΑΦΜ
    Optional<Task> findByCodeNumber(String codeNumber);

    Optional<Task> findByCodeNumberAndProjectOwnerUsername(String codeNumber, String username);

    // Αναζήτηση με όνομα ή επώνυμο
    List<Task> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);

    @Query("""
            SELECT t FROM Task t
            WHERE t.project.owner.username = :username
            AND (LOWER(t.firstName) LIKE LOWER(CONCAT('%', :name, '%'))
                 OR LOWER(t.lastName) LIKE LOWER(CONCAT('%', :name, '%')))
            """)
    List<Task> searchByNameAndOwner(@Param("name") String name, @Param("username") String username);
}