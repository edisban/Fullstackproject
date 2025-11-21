package com.edis.backendproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edis.backendproject.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    
    List<Task> findByProjectId(Long projectId);

    
    Optional<Task> findByCodeNumber(String codeNumber);

   
    @Query("SELECT t FROM Task t WHERE LOWER(t.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(t.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> searchByName(@Param("searchTerm") String searchTerm);
}