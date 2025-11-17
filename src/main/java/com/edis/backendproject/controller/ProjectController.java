package com.edis.backendproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // 📌 GET - Επιστρέφει όλα τα projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // 📌 GET - Επιστρέφει project με συγκεκριμένο id
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable @NonNull Long id) {
        return ResponseEntity.of(projectRepository.findById(id));
    }

    // 
    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request) {
        try {
           
            if (projectRepository.findByName(request.getName()).isPresent()) {
                return ResponseEntity.badRequest().body("Project with this name already exists");
            }

            
            Project project = new Project();
            project.setName(request.getName());
            project.setDescription(request.getDescription());
            project.setStartDate(request.getStartDate());

            // Αποθήκευση στη βάση
            Project saved = projectRepository.save(project);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Error creating project: " + e.getMessage());
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable @NonNull Long id,
                                                 @Valid @RequestBody ProjectRequest request) {
        try {
            return projectRepository.findById(id)
                    .map(project -> {
                        project.setName(request.getName());
                        project.setDescription(request.getDescription());
                        project.setStartDate(request.getStartDate());
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
            if (!projectRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            projectRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
    