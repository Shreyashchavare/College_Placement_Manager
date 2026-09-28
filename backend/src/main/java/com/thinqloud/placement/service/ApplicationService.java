package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.ApplicationDTO;
import com.thinqloud.placement.dto.EligibilityCheckResultDTO;
import com.thinqloud.placement.entity.*;
import com.thinqloud.placement.exception.BusinessException;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.ApplicationRepository;
import com.thinqloud.placement.repository.PlacementDriveRepository;
import com.thinqloud.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PlacementDriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final PlacementDriveService driveService;
    private final PlacementService placementService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              PlacementDriveRepository driveRepository,
                              StudentRepository studentRepository,
                              PlacementDriveService driveService,
                              PlacementService placementService) {
        this.applicationRepository = applicationRepository;
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.driveService = driveService;
        this.placementService = placementService;
    }

    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getApplicationsByDrive(Long driveId) {
        return applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(driveId).stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApplicationDTO> getMyApplications(Long studentId) {
        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId).stream()
                .map(ApplicationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationDTO getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return ApplicationDTO.fromEntity(application);
    }

    @Transactional
    public ApplicationDTO applyForDrive(Long driveId, Long studentId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + driveId));

        if (drive.getStatus() != DriveStatus.OPEN) {
            throw new BusinessException("Cannot apply. Placement Drive is currently " + drive.getStatus());
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for id: " + studentId));

        if (applicationRepository.existsByStudentIdAndPlacementDriveId(studentId, driveId)) {
            throw new BusinessException("You have already applied for this placement drive");
        }

        EligibilityCheckResultDTO eligibility = driveService.checkStudentEligibility(driveId, studentId);
        if (!eligibility.isEligible()) {
            String reasons = String.join("; ", eligibility.getReasons());
            throw new BusinessException("Ineligible to apply: " + reasons);
        }

        Application application = new Application(student, drive);
        application = applicationRepository.save(application);

        return ApplicationDTO.fromEntity(application);
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long id, ApplicationStatus newStatus, String remarks) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        application.setStatus(newStatus);
        if (remarks != null && !remarks.isBlank()) {
            application.setRemarks(remarks);
        }
        application.setUpdatedAt(LocalDateTime.now());

        if (newStatus == ApplicationStatus.SELECTED) {
            placementService.createPlacementFromApplication(application);
        }

        application = applicationRepository.save(application);
        return ApplicationDTO.fromEntity(application);
    }

    @Transactional
    public ApplicationDTO selectCandidate(Long id, String remarks) {
        return updateApplicationStatus(id, ApplicationStatus.SELECTED, remarks != null ? remarks : "Selected in final rounds");
    }

    @Transactional
    public ApplicationDTO rejectCandidate(Long id, String remarks) {
        return updateApplicationStatus(id, ApplicationStatus.REJECTED, remarks != null ? remarks : "Application rejected");
    }
}
