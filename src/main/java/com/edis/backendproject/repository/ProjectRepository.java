package com.edis.backendproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edis.backendproject.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName(String name);

    List<Project> findByOwnerUsername(String username);

    List<Project> findByOwnerIsNull();

    Optional<Project> findByIdAndOwnerUsername(Long id, String username);

    Optional<Project> findByNameAndOwnerUsername(String name, String username);

    boolean existsByIdAndOwnerUsername(Long id, String username);
}