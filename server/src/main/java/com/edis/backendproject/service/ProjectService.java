package com.edis.backendproject.service;

import com.edis.backendproject.config.CacheNames;
import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.lang.Nullable;
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
        return loadProject(id);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public Project createProject(ProjectRequest request) {
        String name = requireName(request);
        ensureUniqueName(name, null);

        Project project = applyRequest(new Project(), request);
        return projectRepository.save(project);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public Project updateProject(Long id, ProjectRequest request) {
        final Project project = loadProject(id);
        String name = requireName(request);
        if (!Objects.equals(project.getName(), name)) {
            ensureUniqueName(name, id);
        }

        Project updated = applyRequest(project, request);
        return projectRepository.save(updated);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.PROJECTS, allEntries = true)
    public void deleteProject(Long id) {
        final Project project = loadProject(id);
        projectRepository.delete(project);
    }

    private Project loadProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        return Objects.requireNonNull(project);
    }

    private void ensureUniqueName(String name, @Nullable Long projectIdToIgnore) {
        projectRepository.findByName(name).ifPresent(existing -> {
            boolean isDifferentEntity = projectIdToIgnore == null || !Objects.equals(existing.getId(), projectIdToIgnore);
            if (isDifferentEntity) {
                throw new IllegalArgumentException("Project with this name already exists");
            }
        });
    }

    private Project applyRequest(Project project, ProjectRequest request) {
        project.setName(requireName(request));
        project.setDescription(request.getDescription());
        return project;
    }

    private String requireName(ProjectRequest request) {
        return Objects.requireNonNull(request.getName(), "Project name must not be null");
    }
}