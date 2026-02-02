package com.edis.backendproject.controller;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.service.IStudentService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

import lombok.RequiredArgsConstructor;

/**
 * REST controller for student operations.
 * Supports CRUD, search by code/name, and filtering by project.
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final IStudentService studentService;

    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents(
            @RequestParam(name = "projectId", required = false) Long projectId) {
        if (projectId != null) {
            List<Student> students = studentService.getStudentsByProject(projectId);
            return ResponseEntity.ok(ApiResponse.success(students));
        }
        @SuppressWarnings("unused")
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @SuppressWarnings({ "unused", "null" })
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Student>>> searchStudents(
            @RequestParam String query,
            @RequestParam(name = "projectId", required = false) Long projectId) {
        String safeQuery = Objects.requireNonNull(query, "query parameter is required");
        List<Student> students;
        if (projectId != null) {
            students = studentService.searchByNameAndProject(safeQuery, projectId);
        } else {
            students = studentService.searchByName(safeQuery);
        }
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    
    @GetMapping("/search/code")
    public ResponseEntity<ApiResponse<Student>> searchByCode(@RequestParam String code) {
        Student student = studentService.searchByCode(code);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<Student>>> getStudentsByProject(@PathVariable Long projectId) {
        List<Student> students = studentService.getStudentsByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    
    @PostMapping
    public ResponseEntity<ApiResponse<Student>> createStudent(@Valid @RequestBody StudentRequest request) {
        Student created = studentService.createStudent(request);
        return ResponseEntity.ok(ApiResponse.success("Student created successfully", created));
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(@PathVariable Long id,
                                        @Valid @RequestBody StudentRequest request) {
        Student updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}
