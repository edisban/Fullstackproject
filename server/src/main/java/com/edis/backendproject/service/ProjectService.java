package com.edis.backendproject.service;

import com.edis.backendproject.config.CacheNames;
import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;

/**
 * Handles project CRUD operations with validation.
 * Checks for duplicate names, manages transactions.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;

    @Override
    @Cacheable(cacheNames = CacheNames.PROJECTS)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        return Objects.requireNonNull(project);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public Project createProject(ProjectRequest request) {
        projectRepository.findByName(request.getName()).ifPresent(p -> {
            throw new IllegalArgumentException("Project with this name already exists");
        });

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return projectRepository.save(project);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public Project updateProject(Long id, ProjectRequest request) {
        final Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        // Check if the new name conflicts with another project
        if (!project.getName().equals(request.getName())) {
            projectRepository.findByName(request.getName()).ifPresent(p -> {
                throw new IllegalArgumentException("Project with this name already exists");
            });
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return projectRepository.save(project);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public void deleteProject(Long id) {
        final Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        projectRepository.delete(Objects.requireNonNull(project));
    }
}