package com.edis.backendproject.service;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;

import java.util.List;

public interface IProjectService {

    List<Project> getAllProjects();

    Project getProjectById(Long id);

    Project createProject(ProjectRequest request);

    Project updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);
}