package com.edis.backendproject.service;

import com.edis.backendproject.config.CacheNames;
import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Project;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.repository.ProjectRepository;
import com.edis.backendproject.repository.StudentRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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

    @Override
    @Cacheable(cacheNames = CacheNames.STUDENTS)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        return Objects.requireNonNull(student);
    }

    public List<Student> getStudentsByProject(Long projectId) {
        List<Student> students = studentRepository.findByProject_Id(projectId);
        return Objects.requireNonNull(students);
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
        List<Student> filtered = allResults.stream()
                .filter(student -> student.getProject() != null && student.getProject().getId().equals(projectId))
                .toList();
        return Objects.requireNonNull(filtered);
    }

    @Transactional
    @CacheEvict(cacheNames = CacheNames.STUDENTS, allEntries = true)
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
    @CacheEvict(cacheNames = CacheNames.STUDENTS, allEntries = true)
    public Student updateStudent(Long id, StudentRequest request) {
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
    @CacheEvict(cacheNames = CacheNames.STUDENTS, allEntries = true)
    public void deleteStudent(Long id) {
        final Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        studentRepository.delete(Objects.requireNonNull(student));
    }
}
