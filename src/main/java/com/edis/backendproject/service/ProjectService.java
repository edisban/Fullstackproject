package com.edis.backendproject.service;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // 📌 GET - Όλα τα projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // 📌 GET - Project by ID
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
    }

    // 📌 POST - Δημιουργία Project
    @Transactional
    public Project createProject(ProjectRequest request) {
        // Έλεγχος αν υπάρχει ήδη project με το ίδιο όνομα
        projectRepository.findByName(request.getName()).ifPresent(p -> {
            throw new IllegalArgumentException("Project with this name already exists");
        });

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());

        return projectRepository.save(project);
    }

    // 📌 PUT - Ενημέρωση Project
    @Transactional
    public Project updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());

        return projectRepository.save(project);
    }

    // 📌 DELETE - Διαγραφή Project
    @Transactional
    public boolean deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            return false;
        }
        projectRepository.deleteById(id);
        return true;
    }
}
