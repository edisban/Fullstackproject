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

    // 🔹 Επιστρέφει όλα τα tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 🔹 Επιστρέφει task ανά ID
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Επιστρέφει tasks για συγκεκριμένο project
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // 🔹 Αναζήτηση task με τίτλο
    @GetMapping("/search")
    public List<Task> searchTasks(@RequestParam String title) {
        return taskRepository.findByTitleContainingIgnoreCase(title);
    }

    // 🔹 Δημιουργία νέου task
    @PostMapping
    public ResponseEntity<Object> createTask(@RequestBody TaskRequest taskRequest) {
        try {
            return projectRepository.findById(taskRequest.getProjectId())
                    .<ResponseEntity<Object>>map(project -> {
                        Task task = new Task();
                        task.setTitle(taskRequest.getTitle());
                        task.setDescription(taskRequest.getDescription());
                        task.setStatus(taskRequest.getStatus());
                        task.setPriority(taskRequest.getPriority());
                        task.setDueDate(taskRequest.getDueDate());
                        task.setProject(project);

                        Task savedTask = taskRepository.save(task);
                        return ResponseEntity.ok(savedTask);
                    })
                    .orElseGet(() -> ResponseEntity.badRequest().body("❌ Project not found"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error creating task: " + e.getMessage());
        }
    }

    // 🔹 Ενημέρωση task
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateTask(@PathVariable Long id, @RequestBody TaskRequest taskRequest) {
        try {
            return taskRepository.findById(id)
                    .<ResponseEntity<Object>>map(task -> {
                        task.setTitle(taskRequest.getTitle());
                        task.setDescription(taskRequest.getDescription());
                        task.setStatus(taskRequest.getStatus());
                        task.setPriority(taskRequest.getPriority());
                        task.setDueDate(taskRequest.getDueDate());
                        Task updated = taskRepository.save(task);
                        return ResponseEntity.ok(updated);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error updating task: " + e.getMessage());
        }
    }

    // 🔹 Διαγραφή task
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable Long id) {
        try {
            return taskRepository.findById(id)
                    .<ResponseEntity<Object>>map(task -> {
                        taskRepository.delete(task);
                        return ResponseEntity.ok("✅ Task deleted successfully");
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Error deleting task: " + e.getMessage());
        }
    }
}
