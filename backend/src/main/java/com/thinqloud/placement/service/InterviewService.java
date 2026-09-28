package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.InterviewStageDTO;
import com.thinqloud.placement.entity.Application;
import com.thinqloud.placement.entity.ApplicationStatus;
import com.thinqloud.placement.entity.InterviewStage;
import com.thinqloud.placement.entity.InterviewStatus;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.ApplicationRepository;
import com.thinqloud.placement.repository.InterviewStageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewStageRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewService(InterviewStageRepository interviewRepository, ApplicationRepository applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<InterviewStageDTO> getInterviewsForApplication(Long applicationId) {
        return interviewRepository.findByApplicationIdOrderByRoundOrderAsc(applicationId).stream()
                .map(InterviewStageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public InterviewStageDTO addInterviewStage(Long applicationId, InterviewStageDTO dto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Automatically transition application to INTERVIEW stage if it is in APPLIED or SCREENING
        if (application.getStatus() == ApplicationStatus.APPLIED || application.getStatus() == ApplicationStatus.SCREENING) {
            application.setStatus(ApplicationStatus.INTERVIEW);
            applicationRepository.save(application);
        }

        InterviewStage stage = new InterviewStage();
        stage.setApplication(application);
        stage.setRoundName(dto.getRoundName());
        stage.setRoundOrder(dto.getRoundOrder() != null ? dto.getRoundOrder() : 1);
        stage.setScheduledAt(dto.getScheduledAt());
        stage.setStatus(dto.getStatus() != null ? dto.getStatus() : InterviewStatus.PENDING);
        stage.setFeedback(dto.getFeedback());

        stage = interviewRepository.save(stage);
        return InterviewStageDTO.fromEntity(stage);
    }

    @Transactional
    public InterviewStageDTO recordResult(Long stageId, InterviewStatus status, String feedback) {
        InterviewStage stage = interviewRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview stage not found with id: " + stageId));

        stage.setStatus(status);
        if (feedback != null && !feedback.isBlank()) {
            stage.setFeedback(feedback);
        }

        stage = interviewRepository.save(stage);
        return InterviewStageDTO.fromEntity(stage);
    }

    @Transactional
    public void deleteStage(Long stageId) {
        InterviewStage stage = interviewRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview stage not found with id: " + stageId));
        interviewRepository.delete(stage);
    }
}
