package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUserEmail(String email);
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);

    @Query("SELECT s FROM Student s WHERE " +
           "(:allowedDepts = 'ALL' OR LOWER(s.department) LIKE LOWER(CONCAT('%', :deptKeyword, '%'))) AND " +
           "s.cgpa >= :minCgpa AND " +
           "s.activeBacklogs <= :maxBacklogs AND " +
           "s.graduationYear = :gradYear")
    List<Student> findEligibleStudents(@Param("allowedDepts") String allowedDepts,
                                       @Param("deptKeyword") String deptKeyword,
                                       @Param("minCgpa") Double minCgpa,
                                       @Param("maxBacklogs") Integer maxBacklogs,
                                       @Param("gradYear") Integer gradYear);
}
