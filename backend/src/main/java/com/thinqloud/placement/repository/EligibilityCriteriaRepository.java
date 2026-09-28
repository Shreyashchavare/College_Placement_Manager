package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.EligibilityCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EligibilityCriteriaRepository extends JpaRepository<EligibilityCriteria, Long> {
    Optional<EligibilityCriteria> findByPlacementDriveId(Long placementDriveId);
}
