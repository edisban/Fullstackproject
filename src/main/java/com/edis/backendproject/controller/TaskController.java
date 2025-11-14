package com.edis.backendproject.controller;

import java.util.List;
import java.util.Objects;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edis.backendproject.model.Task;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.TaskRepository;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable @NonNull Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable @NonNull Long id) {
        return ResponseEntity.of(taskRepository.findById(Objects.requireNonNull(id)));
    }

    @GetMapping("/search/code")
    public ResponseEntity<Task> searchByCode(@RequestParam String code) {
        return taskRepository.findByCodeNumber(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/name")
    public List<Task> searchByName(@RequestParam String name) {
        return taskRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        if (!projectRepository.existsById(Objects.requireNonNull(request.getProjectId()))) {
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
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

    projectRepository.findById(Objects.requireNonNull(request.getProjectId())).ifPresent(task::setProject);

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable @NonNull Long id, @RequestBody TaskRequest request) {
        return taskRepository.findById(Objects.requireNonNull(id))
                .map(task -> {
                    task.setCodeNumber(request.getCodeNumber());
                    task.setFirstName(request.getFirstName());
                    task.setLastName(request.getLastName());
                    task.setDateOfBirth(request.getDateOfBirth());
                    task.setTitle(request.getTitle());
                    task.setDescription(request.getDescription());
                    task.setStatus(request.getStatus());
                    task.setPriority(request.getPriority());
                    task.setDueDate(request.getDueDate());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable @NonNull Long id) {
        if (!taskRepository.existsById(Objects.requireNonNull(id))) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}