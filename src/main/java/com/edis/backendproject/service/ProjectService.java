package com.edis.backendproject.service;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Handles project CRUD operations with validation.
 * Checks for duplicate names, manages transactions.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    @Transactional
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
    public Project updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
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
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        projectRepository.delete(project);
    }
}