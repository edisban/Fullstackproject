package com.edis.backendproject.service;

import com.edis.backendproject.dto.TaskRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Task;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TaskService implements ITaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    // 📌 GET ALL
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 📌 GET Task by ID
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
    }

    // 📌 GET tasks by project
    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    // Search by codeNumber or AM
    public Task searchByCodeOrAm(String code, String am) {
        String query = (code != null && !code.isBlank()) ? code :
                       (am != null && !am.isBlank())     ? am : null;

        if (query == null) {
            throw new IllegalArgumentException("Provide ?code= or ?am=");
        }

        return taskRepository.findByCodeNumber(query)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
    }

    // Search by codeNumber (legacy method for backwards compatibility)
    public Task searchByCode(String codeOrAm) {
        return taskRepository.findByCodeNumber(codeOrAm)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
    }

    // 📌 Search by first/last name
    public List<Task> searchByName(String name) {
        return taskRepository.searchByName(name);
    }

    // 📌 CREATE task
    @Transactional
    public Task createTask(TaskRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Task task = new Task();
        task.setCodeNumber(request.getCodeNumber());
        task.setFirstName(request.getFirstName());
        task.setLastName(request.getLastName());
        task.setDateOfBirth(request.getDateOfBirth());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setProject(project);

        return taskRepository.save(task);
    }

    // 📌 UPDATE task
    @Transactional
    public Task updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        task.setCodeNumber(request.getCodeNumber());
        task.setFirstName(request.getFirstName());
        task.setLastName(request.getLastName());
        task.setDateOfBirth(request.getDateOfBirth());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        return taskRepository.save(task);
    }

    // 📌 DELETE task
    @Transactional
    public boolean deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }

        taskRepository.deleteById(id);
        return true;
    }
}
