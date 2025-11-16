package com.edis.backendproject.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.service.AuthenticatedUserService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @GetMapping
    public List<Project> getAllProjects() {
        String username = authenticatedUserService.getCurrentUsername();
        List<Project> projects = new ArrayList<>(projectRepository.findByOwnerUsername(username));
        if (isAdmin(username)) {
            projects.addAll(projectRepository.findByOwnerIsNull());
        }
        return projects;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable @NonNull Long id) {
        String username = authenticatedUserService.getCurrentUsername();
        Optional<Project> project = projectRepository.findByIdAndOwnerUsername(id, username);

        if (project.isEmpty() && isAdmin(username)) {
            project = projectRepository.findById(id)
                    .filter(p -> p.getOwner() == null);
        }

        return project
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        try {
            User currentUser = authenticatedUserService.getCurrentUser();
            if (projectRepository.findByNameAndOwnerUsername(project.getName(), currentUser.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Project with this name already exists for this user");
            }
            project.setOwner(currentUser);
            Project saved = projectRepository.save(project);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating project: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable @NonNull Long id, @RequestBody Project projectDetails) {
        try {
            String username = authenticatedUserService.getCurrentUsername();
            Optional<Project> target = projectRepository.findByIdAndOwnerUsername(id, username);

            if (target.isEmpty() && isAdmin(username)) {
                target = projectRepository.findById(id)
                        .filter(p -> p.getOwner() == null);
            }

            return target
                    .map(project -> {
                        project.setName(projectDetails.getName());
                        project.setDescription(projectDetails.getDescription());
                        project.setStartDate(projectDetails.getStartDate());
                        if (project.getOwner() == null) {
                            project.setOwner(authenticatedUserService.getCurrentUser());
                        }
                        return ResponseEntity.ok(projectRepository.save(project));
                    })
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable @NonNull Long id) {
        try {
            String username = authenticatedUserService.getCurrentUsername();

            if (projectRepository.existsByIdAndOwnerUsername(id, username)) {
                projectRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            }

            if (isAdmin(username)) {
                Optional<Project> project = projectRepository.findById(id)
                        .filter(p -> p.getOwner() == null);
                if (project.isPresent()) {
                    projectRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                }
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private boolean isAdmin(String username) {
        return "admin".equalsIgnoreCase(username);
    }
}