package com.edis.backendproject.service;

import com.edis.backendproject.dto.TaskRequest;
import com.edis.backendproject.model.Task;

import java.util.List;

public interface ITaskService {

    List<Task> getAllTasks();

    Task getTaskById(Long id);

    List<Task> getTasksByProject(Long projectId);

    Task searchByCodeOrAm(String code, String am);

    Task searchByCode(String codeOrAm);

    List<Task> searchByName(String name);

    Task createTask(TaskRequest request);

    Task updateTask(Long id, TaskRequest request);

    boolean deleteTask(Long id);
}
