package com.edis.backendproject.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edis.backendproject.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Students of one project whose first name, last name, full name or student ID contains the
     * (already lower-cased, escaped) LIKE pattern.
     */
    @EntityGraph(attributePaths = "project")
    @Query("""
            select s from Student s
            where s.project.id = :projectId
              and (lower(s.firstName) like :pattern escape '\\'
                   or lower(s.lastName) like :pattern escape '\\'
                   or lower(concat(s.firstName, ' ', s.lastName)) like :pattern escape '\\'
                   or s.codeNumber like :pattern escape '\\')
            """)
    Page<Student> searchInProject(@Param("projectId") Long projectId,
                                  @Param("pattern") String pattern,
                                  Pageable pageable);

    @EntityGraph(attributePaths = {"project", "project.owner"})
    @Query("select s from Student s where s.id = :id")
    Optional<Student> findWithProjectById(@Param("id") Long id);

    boolean existsByProjectIdAndCodeNumber(Long projectId, String codeNumber);

    boolean existsByProjectIdAndCodeNumberAndIdNot(Long projectId, String codeNumber, Long id);
}
