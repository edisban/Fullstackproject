package com.edis.backendproject.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.StudentRepository;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private StudentService studentService;

    @Test
    void getAllStudentsDelegatesToRepository() {
        List<Student> students = List.of(Student.builder().id(1L).firstName("Amy").build());
        when(studentRepository.findAll()).thenReturn(students);

        List<Student> result = studentService.getAllStudents();

        assertThat(result).isEqualTo(students);
        verify(studentRepository).findAll();
    }

    @Test
    void searchByCodeRejectsBlankInput() {
        assertThatThrownBy(() -> studentService.searchByCode(" "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Code cannot be empty");
    }

    @Test
    void searchByCodeReturnsMatchWhenPresent() {
        Student student = Student.builder().id(4L).codeNumber("123").build();
        when(studentRepository.findByCodeNumber("123")).thenReturn(Optional.of(student));

        Student result = studentService.searchByCode("123");

        assertThat(result).isEqualTo(student);
    }

    @Test
    void createStudentPersistsEntityWithResolvedProject() {
        StudentRequest request = buildRequest();
        Project project = Project.builder().id(20L).name("AI").build();
        when(projectRepository.findById(20L)).thenReturn(Optional.of(project));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Student created = studentService.createStudent(request);

        ArgumentCaptor<Student> captor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(captor.capture());
        Student saved = captor.getValue();
        assertThat(saved.getProject()).isEqualTo(project);
        assertThat(saved.getCodeNumber()).isEqualTo("123456");
        assertThat(created).isSameAs(saved);
    }

    @Test
    void createStudentWithoutProjectThrowsEntityNotFound() {
        StudentRequest request = buildRequest();
        when(projectRepository.findById(request.getProjectId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.createStudent(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    void updateStudentOverwritesEditableFields() {
        Student existing = Student.builder()
                .id(5L)
                .codeNumber("old")
                .firstName("Old")
                .lastName("Name")
                .title("Dev")
                .description("desc")
                .dateOfBirth(LocalDate.of(1990, 1, 1))
                .build();
        when(studentRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(studentRepository.save(existing)).thenAnswer(invocation -> invocation.getArgument(0));

        StudentRequest request = new StudentRequest(
                "999",
                "Jane",
                "Doe",
                LocalDate.of(2001, 2, 2),
                "Engineer",
                "New desc",
                99L);

        Student updated = studentService.updateStudent(5L, request);

        assertThat(updated.getCodeNumber()).isEqualTo("999");
        assertThat(updated.getFirstName()).isEqualTo("Jane");
        assertThat(updated.getTitle()).isEqualTo("Engineer");
        verify(studentRepository).save(existing);
    }

    @Test
    void updateStudentWhenMissingThrowsEntityNotFound() {
        StudentRequest request = buildRequest();
        when(studentRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.updateStudent(5L, request))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void searchByNameAndProjectFiltersResults() {
        Project targetProject = Project.builder().id(1L).name("Target").build();
        Project otherProject = Project.builder().id(2L).name("Other").build();
        Student matching = Student.builder().id(10L).project(targetProject).build();
        Student other = Student.builder().id(20L).project(otherProject).build();
        when(studentRepository.searchByName("amy")).thenReturn(List.of(matching, other));

        List<Student> results = studentService.searchByNameAndProject("amy", 1L);

        assertThat(results).containsExactly(matching);
    }

    @Test
    void deleteStudentRemovesEntityWhenFound() {
        Student student = Student.builder().id(3L).build();
        when(studentRepository.findById(3L)).thenReturn(Optional.of(student));

        studentService.deleteStudent(3L);

        verify(studentRepository).delete(student);
    }

    @Test
    void deleteStudentWhenMissingThrowsEntityNotFound() {
        when(studentRepository.findById(44L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.deleteStudent(44L))
                .isInstanceOf(EntityNotFoundException.class);
    }

    private StudentRequest buildRequest() {
        return new StudentRequest(
                "123456",
                "Alice",
                "Smith",
                LocalDate.of(2000, 1, 1),
                "Analyst",
                "Great student",
                20L);
    }
}
