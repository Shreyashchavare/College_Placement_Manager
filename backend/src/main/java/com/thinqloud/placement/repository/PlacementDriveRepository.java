package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.DriveStatus;
import com.thinqloud.placement.entity.PlacementDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByStatusOrderByCreatedAtDesc(DriveStatus status);
    List<PlacementDrive> findAllByOrderByCreatedAtDesc();
    List<PlacementDrive> findByCompanyId(Long companyId);
    long countByStatus(DriveStatus status);
}
