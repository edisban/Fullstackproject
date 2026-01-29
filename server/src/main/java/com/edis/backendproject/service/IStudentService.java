package com.edis.backendproject.service;

import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Student;

import java.util.List;

import org.springframework.lang.NonNull;

public interface IStudentService {

    List<Student> getAllStudents();

    Student getStudentById(@NonNull Long id);

    List<Student> getStudentsByProject(@NonNull Long projectId);

    Student searchByCode(String code);

    List<Student> searchByName(String name);

    List<Student> searchByNameAndProject(String name, @NonNull Long projectId);

    Student createStudent(StudentRequest request);

    Student updateStudent(@NonNull Long id, StudentRequest request);

    void deleteStudent(@NonNull Long id);
}