package com.edis.backendproject.controller;

import com.edis.backendproject.dto.ApiResponse;
import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Student;
import com.edis.backendproject.service.IStudentService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for student operations.
 * Supports CRUD, search by code/name, and filtering by project.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final IStudentService studentService;

    public StudentController(IStudentService studentService) {
        this.studentService = studentService;
    }

    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents(
            @RequestParam(name = "projectId", required = false) Long projectId) {
        List<Student> students;
        if (projectId != null) {
            students = studentService.getStudentsByProject(projectId); 
        } else {
            students = studentService.getAllStudents();
        }
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Student>>> searchStudents(
            @RequestParam String query,
            @RequestParam(name = "projectId", required = false) Long projectId) {
        List<Student> students;
        if (projectId != null) {
            students = studentService.searchByNameAndProject(query, projectId);
        } else {
            students = studentService.searchByName(query);
        }
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    
    @GetMapping("/search/code")
    public ResponseEntity<ApiResponse<Student>> searchByCode(
            @RequestParam(name = "code", required = false) String code,
            @RequestParam(name = "am", required = false) String am
    ) {
        Student student = studentService.searchByCodeOrAm(code, am);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    
    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<Student>>> searchByName(@RequestParam String name) {
        List<Student> students = studentService.searchByName(name);
        return ResponseEntity.ok(ApiResponse.success(students));
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
    public ResponseEntity<ApiResponse<Student>> updateStudent(@PathVariable @NonNull Long id,
                                        @Valid @RequestBody StudentRequest request) {
        Student updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable @NonNull Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}
