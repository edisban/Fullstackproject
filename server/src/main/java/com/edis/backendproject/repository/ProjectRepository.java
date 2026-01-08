package com.edis.backendproject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edis.backendproject.model.Project;

/**
 * JPA repository for Project entity.
 * Provides CRUD operations and custom query to find by name.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName(String name);
}