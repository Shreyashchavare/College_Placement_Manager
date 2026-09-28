package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.Placement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    List<Placement> findAllByOrderByOfferDateDesc();
    List<Placement> findByStudentId(Long studentId);
    Optional<Placement> findByStudentIdAndPlacementDriveId(Long studentId, Long placementDriveId);
    boolean existsByStudentIdAndPlacementDriveId(Long studentId, Long placementDriveId);

    @Query("SELECT AVG(p.packageLpa) FROM Placement p")
    Double findAveragePackage();

    @Query("SELECT MAX(p.packageLpa) FROM Placement p")
    Double findHighestPackage();
}
