package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.Application;
import com.thinqloud.placement.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentIdOrderByAppliedAtDesc(Long studentId);
    List<Application> findByPlacementDriveIdOrderByAppliedAtDesc(Long placementDriveId);
    Optional<Application> findByStudentIdAndPlacementDriveId(Long studentId, Long placementDriveId);
    boolean existsByStudentIdAndPlacementDriveId(Long studentId, Long placementDriveId);
    long countByStatus(ApplicationStatus status);
    List<Application> findByStatus(ApplicationStatus status);
}
