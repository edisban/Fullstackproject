package com.edis.backendproject.controller;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.dto.TaskRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Task;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.TaskRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")

public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskController(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/search/code")
    public ResponseEntity<?> searchByCode(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "am", required = false) String am) {
        String lookup = (code != null && !code.isBlank()) ? code : (am != null && !am.isBlank() ? am : null);
        if (lookup == null) {
            return ResponseEntity.badRequest().body("Missing query param: provide 'code' or 'am'");
        }
        return taskRepository.findByCodeNumber(lookup)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/name")
    public List<Task> searchByName(@RequestParam String name) {
        return taskRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        if (projectId == null) {
            return List.of();
        }
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.of(taskRepository.findById(id));
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Long projectId = request.getProjectId();
        if (projectId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = new Task();
        task.setCodeNumber(request.getCodeNumber());
        task.setFirstName(request.getFirstName());
        task.setLastName(request.getLastName());
        task.setDateOfBirth(request.getDateOfBirth());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        project.ifPresent(task::setProject);

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable @NonNull Long id,
                                           @Valid @RequestBody TaskRequest request) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setCodeNumber(request.getCodeNumber());
                    task.setFirstName(request.getFirstName());
                    task.setLastName(request.getLastName());
                    task.setDateOfBirth(request.getDateOfBirth());
                    task.setTitle(request.getTitle());
                    task.setDescription(request.getDescription());
                    task.setStatus(request.getStatus());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable @NonNull Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}