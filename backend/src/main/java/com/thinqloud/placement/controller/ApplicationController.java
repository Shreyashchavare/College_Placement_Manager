package com.thinqloud.placement.controller;

import com.thinqloud.placement.dto.ApplicationDTO;
import com.thinqloud.placement.dto.StatusUpdateRequest;
import com.thinqloud.placement.entity.ApplicationStatus;
import com.thinqloud.placement.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/drive/{driveId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByDrive(@PathVariable Long driveId) {
        return ResponseEntity.ok(applicationService.getApplicationsByDrive(driveId));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(applicationService.getMyApplications(studentId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping("/apply/{driveId}/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApplicationDTO> applyForDrive(@PathVariable Long driveId, @PathVariable Long studentId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.applyForDrive(driveId, studentId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationDTO> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        ApplicationStatus status = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, request.getRemarks()));
    }

    @PostMapping("/{id}/select")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationDTO> selectCandidate(@PathVariable Long id, @RequestBody(required = false) StatusUpdateRequest request) {
        String remarks = (request != null) ? request.getRemarks() : "Selected in final round";
        return ResponseEntity.ok(applicationService.selectCandidate(id, remarks));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationDTO> rejectCandidate(@PathVariable Long id, @RequestBody(required = false) StatusUpdateRequest request) {
        String remarks = (request != null) ? request.getRemarks() : "Rejected in interview process";
        return ResponseEntity.ok(applicationService.rejectCandidate(id, remarks));
    }
}
