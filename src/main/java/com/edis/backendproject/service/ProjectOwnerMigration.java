package com.edis.backendproject.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.User;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.UserRepository;

@Component
public class ProjectOwnerMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProjectOwnerMigration.class);
    private static final String DEFAULT_ADMIN_USERNAME = "admin";

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectOwnerMigration(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        List<Project> unownedProjects = projectRepository.findByOwnerIsNull();
        if (unownedProjects.isEmpty()) {
            return;
        }

        userRepository.findByUsername(DEFAULT_ADMIN_USERNAME)
                .ifPresentOrElse(admin -> assignProjectsToAdmin(unownedProjects, admin),
                        () -> log.warn("Found {} unowned projects but no '{}' user to migrate them to.",
                                unownedProjects.size(), DEFAULT_ADMIN_USERNAME));
    }

    private void assignProjectsToAdmin(List<Project> projects, User admin) {
        projects.forEach(project -> project.setOwner(admin));
        projectRepository.saveAll(projects);
        log.info("Migrated {} legacy projects to user '{}'", projects.size(), admin.getUsername());
    }
}
