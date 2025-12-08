package com.edis.backendproject.service;

import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.StudentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Handles student CRUD operations and search functionality.
 * Supports search by code number and name with various endpoints.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService implements IStudentService {

    private final StudentRepository studentRepository;
    private final ProjectRepository projectRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
    }

    public List<Student> getStudentsByProject(Long projectId) {
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

    public List<Student> searchByNameAndProject(String name, Long projectId) {
        List<Student> allResults = studentRepository.searchByName(name);
        return allResults.stream()
                .filter(student -> student.getProject() != null && student.getProject().getId().equals(projectId))
                .toList();
    }

    @Transactional
    public Student createStudent(StudentRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Student student = Student.builder()
                .codeNumber(request.getCodeNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .build();

        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        student.setCodeNumber(request.getCodeNumber());
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setTitle(request.getTitle());
        student.setDescription(request.getDescription());

        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        studentRepository.delete(student);
    }
}
