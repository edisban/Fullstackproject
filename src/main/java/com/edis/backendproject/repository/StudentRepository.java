package com.edis.backendproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edis.backendproject.model.Student;

/**
 * JPA repository for Student entity.
 * Custom queries for searching by project, code number, and name (partial match).
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Spring Data JPA derives this query automatically from method name
    List<Student> findByProject_Id(Long projectId);

    Optional<Student> findByCodeNumber(String codeNumber);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.codeNumber) = LOWER(:searchTerm) OR " +
           "LOWER(s.firstName) = LOWER(:searchTerm) OR " +
           "LOWER(s.lastName) = LOWER(:searchTerm)")
    List<Student> searchByName(@Param("searchTerm") String searchTerm);
}