package com.edis.backendproject.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.edis.backendproject.dto.ProjectRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @Test
    void getAllProjectsReturnsRepositoryResults() {
        Project project = Project.builder().id(1L).name("Alpha").description("desc").build();
        when(projectRepository.findAll()).thenReturn(List.of(project));

        List<Project> result = projectService.getAllProjects();

        assertThat(result).containsExactly(project);
        verify(projectRepository).findAll();
    }

    @Test
    void createProjectWhenNameIsUniquePersistsEntity() {
        ProjectRequest request = new ProjectRequest("New Project", "desc");
        when(projectRepository.findByName("New Project")).thenReturn(Optional.empty());
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        Project created = projectService.createProject(request);

        assertThat(created.getId()).isEqualTo(10L);
        assertThat(created.getName()).isEqualTo("New Project");
        assertThat(created.getDescription()).isEqualTo("desc");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    void createProjectWhenNameExistsThrowsException() {
        ProjectRequest request = new ProjectRequest("Existing", "desc");
        when(projectRepository.findByName("Existing")).thenReturn(Optional.of(new Project()));

        assertThatThrownBy(() -> projectService.createProject(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void updateProjectWhenEntityMissingThrowsEntityNotFound() {
        ProjectRequest request = new ProjectRequest("Updated", "desc");
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.updateProject(1L, request))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void updateProjectWithSameNameSkipsDuplicateCheckAndSaves() {
        Project existing = Project.builder().id(5L).name("Keep Name").description("old").build();
        ProjectRequest request = new ProjectRequest("Keep Name", "new desc");
        when(projectRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(projectRepository.save(existing)).thenReturn(existing);

        Project updated = projectService.updateProject(5L, request);

        assertThat(updated.getDescription()).isEqualTo("new desc");
        verify(projectRepository, never()).findByName("Keep Name");
        verify(projectRepository).save(existing);
    }

    @Test
    void updateProjectWhenRenamingToExistingNameThrows() {
        Project existing = Project.builder().id(7L).name("Original").build();
        when(projectRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(projectRepository.findByName("Conflict"))
                .thenReturn(Optional.of(Project.builder().id(8L).name("Conflict").build()));

        ProjectRequest request = new ProjectRequest("Conflict", "desc");

        assertThatThrownBy(() -> projectService.updateProject(7L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void deleteProjectRemovesEntityWhenFound() {
        Project existing = Project.builder().id(4L).name("Project").build();
        when(projectRepository.findById(4L)).thenReturn(Optional.of(existing));

        projectService.deleteProject(4L);

        verify(projectRepository).delete(existing);
    }

    @Test
    void deleteProjectWhenMissingThrowsEntityNotFound() {
        when(projectRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.deleteProject(9L))
                .isInstanceOf(EntityNotFoundException.class);
    }
}
