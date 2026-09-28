package com.thinqloud.placement.repository;

import com.thinqloud.placement.entity.InterviewStage;
import com.thinqloud.placement.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewStageRepository extends JpaRepository<InterviewStage, Long> {
    List<InterviewStage> findByApplicationIdOrderByRoundOrderAsc(Long applicationId);
    List<InterviewStage> findByStatus(InterviewStatus status);
}
