package com.edis.backendproject.controller;

import com.edis.backendproject.model.Task;
import com.edis.backendproject.repository.TaskRepository;
import com.edis.backendproject.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
        if (!projectRepository.existsById(request.getProjectId())) {
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

        projectRepository.findById(request.getProjectId()).ifPresent(task::setProject);

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskRequest request) {
        return taskRepository.findById(id)
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
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}