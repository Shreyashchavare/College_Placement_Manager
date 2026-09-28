package com.thinqloud.placement.controller;

import com.thinqloud.placement.dto.EligibilityCheckResultDTO;
import com.thinqloud.placement.dto.PlacementDriveDTO;
import com.thinqloud.placement.dto.StatusUpdateRequest;
import com.thinqloud.placement.dto.StudentDTO;
import com.thinqloud.placement.entity.DriveStatus;
import com.thinqloud.placement.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    public PlacementDriveController(PlacementDriveService driveService) {
        this.driveService = driveService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PlacementDriveDTO>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @GetMapping("/open")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<PlacementDriveDTO>> getOpenDrives() {
        return ResponseEntity.ok(driveService.getOpenDrives());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<PlacementDriveDTO> getDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(driveService.getDriveById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlacementDriveDTO> createDrive(@Valid @RequestBody PlacementDriveDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driveService.createDrive(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlacementDriveDTO> updateDrive(@PathVariable Long id, @Valid @RequestBody PlacementDriveDTO dto) {
        return ResponseEntity.ok(driveService.updateDrive(id, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlacementDriveDTO> updateDriveStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        DriveStatus status = DriveStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(driveService.updateDriveStatus(id, status));
    }

    @GetMapping("/{id}/eligibility-check/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<EligibilityCheckResultDTO> checkEligibility(@PathVariable Long id, @PathVariable Long studentId) {
        return ResponseEntity.ok(driveService.checkStudentEligibility(id, studentId));
    }

    @GetMapping("/{id}/eligible-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentDTO>> getEligibleStudents(@PathVariable Long id) {
        return ResponseEntity.ok(driveService.getEligibleStudentsForDrive(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDrive(@PathVariable Long id) {
        driveService.deleteDrive(id);
        return ResponseEntity.noContent().build();
    }
}
