package com.edis.backendproject.controller;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.dto.TaskRequest;
import com.edis.backendproject.model.Task;
import com.edis.backendproject.service.ITaskService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final ITaskService taskService;

    public TaskController(ITaskService taskService) {
        this.taskService = taskService;
    }

    // 📌 GET ALL
    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    // Search by code or AM
    @GetMapping("/search/code")
    public ResponseEntity<ApiResponse<Task>> searchByCode(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "am", required = false) String am
    ) {
        try {
            Task task = taskService.searchByCodeOrAm(code, am);
            return ResponseEntity.ok(ApiResponse.success(task));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    // 📌 Search by first/last name
    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<Task>>> searchByName(@RequestParam String name) {
        List<Task> tasks = taskService.searchByName(name);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    // 📌 GET Tasks by project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<Task>>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    // 📌 GET task by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getTaskById(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(ApiResponse.success(task));
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }

    // 📌 CREATE task
    @PostMapping
    public ResponseEntity<ApiResponse<Task>> createTask(@Valid @RequestBody TaskRequest request) {
        try {
            Task created = taskService.createTask(request);
            return ResponseEntity.ok(ApiResponse.success("Task created successfully", created));
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 📌 UPDATE task
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> updateTask(@PathVariable @NonNull Long id,
                                        @Valid @RequestBody TaskRequest request) {
        try {
            Task updated = taskService.updateTask(id, request);
            return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
        } catch (jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // 📌 DELETE task
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable @NonNull Long id) {
        boolean deleted = taskService.deleteTask(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found"));
        }
    }
}
