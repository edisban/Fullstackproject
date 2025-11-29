package com.edis.backendproject.service;

import com.edis.backendproject.dto.StudentRequest;
import com.edis.backendproject.model.Student;

import java.util.List;

public interface IStudentService {

    List<Student> getAllStudents();

    Student getStudentById(Long id);

    List<Student> getStudentsByProject(Long projectId);

    Student searchByCodeOrAm(String code, String am);

    Student searchByCode(String codeOrAm);

    List<Student> searchByName(String name);

    List<Student> searchByNameAndProject(String name, Long projectId);

    Student createStudent(StudentRequest request);

    Student updateStudent(Long id, StudentRequest request);

    void deleteStudent(Long id);
}