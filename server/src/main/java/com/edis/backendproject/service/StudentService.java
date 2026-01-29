package com.edis.backendproject.service;

import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.StudentRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;

/**
 * Handles student CRUD operations and search functionality.
 * Supports search by code number and name with various endpoints.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StudentService implements IStudentService {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(@NonNull Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
    }

    public List<Student> getStudentsByProject(@NonNull Long projectId) {
        return studentRepository.findByProject_Id(projectId);
    }

    public Student searchByCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Code cannot be empty");
        }
        return studentRepository.findByCodeNumber(code)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
    }

    public List<Student> searchByName(String name) {
        return studentRepository.searchByName(name);
    }

    public List<Student> searchByNameAndProject(String name, @NonNull Long projectId) {
        List<Student> allResults = studentRepository.searchByName(name);
        return allResults.stream()
                .filter(student -> student.getProject() != null && student.getProject().getId().equals(projectId))
                .toList();
    }

    @Transactional
    public Student createStudent(StudentRequest request) {
        final Long projectId = Objects.requireNonNull(request.getProjectId(), "Project ID is required");
        final Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Student student = new Student();
        student.setCodeNumber(request.getCodeNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setTitle(request.getTitle());
        student.setDescription(request.getDescription());
        student.setProject(project);

        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(@NonNull Long id, StudentRequest request) {
        final Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        student.setCodeNumber(request.getCodeNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setTitle(request.getTitle());
        student.setDescription(request.getDescription());

        return studentRepository.save(Objects.requireNonNull(student));
    }

    @Transactional
    public void deleteStudent(@NonNull Long id) {
        final Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        studentRepository.delete(Objects.requireNonNull(student));
    }
}
