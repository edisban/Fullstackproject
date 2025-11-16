package com.edis.backendproject.controller;

import java.util.List;
import java.util.Objects;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Task;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.TaskRepository;
import com.edis.backendproject.service.AuthenticatedUserService;

@RestController
@RequestMapping({"/api/tasks", "/api/students"})
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuthenticatedUserService authenticatedUserService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findByProjectOwnerUsername(authenticatedUserService.getCurrentUsername());
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable @NonNull Long projectId) {
        String username = authenticatedUserService.getCurrentUsername();
        if (!projectRepository.existsByIdAndOwnerUsername(projectId, username)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        return taskRepository.findByProjectIdAndProjectOwnerUsername(projectId, username);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable @NonNull Long id) {
        return taskRepository.findByIdAndProjectOwnerUsername(Objects.requireNonNull(id), authenticatedUserService.getCurrentUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/search/code")
    public ResponseEntity<?> searchByCode(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "am", required = false) String am) {
        String lookup = (code != null && !code.isBlank()) ? code : (am != null && !am.isBlank() ? am : null);
        if (lookup == null) {
            return ResponseEntity.badRequest().body("Missing query param: provide 'code' or 'am'");
        }
        return taskRepository.findByCodeNumberAndProjectOwnerUsername(lookup, authenticatedUserService.getCurrentUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search/name")
    public List<Task> searchByName(@RequestParam String name) {
        return taskRepository.searchByNameAndOwner(name, authenticatedUserService.getCurrentUsername());
    }

    @SuppressWarnings("null")
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody TaskRequest request) {
        Long projectId = Objects.requireNonNull(request.getProjectId());
        String username = authenticatedUserService.getCurrentUsername();

        Project project = projectRepository.findByIdAndOwnerUsername(projectId, username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        Task task = buildTaskFromRequest(new Task(), request);
        task.setProject(project);

    Task savedTask = Optional.ofNullable(taskRepository.save(task))
        .orElseThrow(() -> new IllegalStateException("Unable to save task"));
    return ResponseEntity.ok(savedTask);
    }

    @SuppressWarnings("null")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable @NonNull Long id, @RequestBody TaskRequest request) {
        String username = authenticatedUserService.getCurrentUsername();
    Task task = taskRepository.findByIdAndProjectOwnerUsername(Objects.requireNonNull(id), username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        buildTaskFromRequest(task, request);

        if (request.getProjectId() != null && !request.getProjectId().equals(task.getProject().getId())) {
            Project targetProject = projectRepository.findByIdAndOwnerUsername(request.getProjectId(), username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
            task.setProject(targetProject);
        }

    Task savedTask = Optional.ofNullable(taskRepository.save(task))
        .orElseThrow(() -> new IllegalStateException("Unable to save task"));
    return ResponseEntity.ok(savedTask);
    }

    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable @NonNull Long id) {
    Task task = taskRepository.findByIdAndProjectOwnerUsername(Objects.requireNonNull(id), authenticatedUserService.getCurrentUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

    taskRepository.delete(task);
        return ResponseEntity.noContent().build();
    }

    private Task buildTaskFromRequest(Task task, TaskRequest request) {
        task.setCodeNumber(request.getCodeNumber());
        task.setFirstName(request.getFirstName());
        task.setLastName(request.getLastName());
        task.setDateOfBirth(request.getDateOfBirth());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        return task;
    }

    // DTO placed inline for simplicity and reliability
    public static class TaskRequest {
        // Accept both "codeNumber" and alias "am" from JSON
        @com.fasterxml.jackson.annotation.JsonAlias({"am"})
        private String codeNumber;
        private String firstName;
        private String lastName;
        private java.time.LocalDate dateOfBirth;
        private String title;
        private String description;
        private String status;
        private String priority;
        private java.time.LocalDate dueDate;
        private Long projectId;

        public String getCodeNumber() { return codeNumber; }
        public void setCodeNumber(String codeNumber) { this.codeNumber = codeNumber; }

        // Convenience setter to support explicit "am" without @JsonAlias in older Jackson
        @com.fasterxml.jackson.annotation.JsonProperty("am")
        public void setAm(String am) { this.codeNumber = am; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public java.time.LocalDate getDateOfBirth() { return dateOfBirth; }
        public void setDateOfBirth(java.time.LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public java.time.LocalDate getDueDate() { return dueDate; }
        public void setDueDate(java.time.LocalDate dueDate) { this.dueDate = dueDate; }
        public Long getProjectId() { return projectId; }
        public void setProjectId(Long projectId) { this.projectId = projectId; }
    }
}