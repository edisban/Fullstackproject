package com.edis.backendproject.service;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;

import java.util.List;

import org.springframework.lang.NonNull;

public interface IProjectService {

    List<Project> getAllProjects();

    Project getProjectById(@NonNull Long id);

    Project createProject(ProjectRequest request);

    Project updateProject(@NonNull Long id, ProjectRequest request);

    void deleteProject(@NonNull Long id);
}