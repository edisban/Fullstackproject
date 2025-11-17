package com.edis.backendproject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edis.backendproject.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName(String name);
}