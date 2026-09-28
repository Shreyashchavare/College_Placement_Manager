package com.thinqloud.placement.controller;

import com.thinqloud.placement.dto.InterviewStageDTO;
import com.thinqloud.placement.dto.StatusUpdateRequest;
import com.thinqloud.placement.entity.InterviewStatus;
import com.thinqloud.placement.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<InterviewStageDTO>> getInterviewsForApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewsForApplication(applicationId));
    }

    @PostMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InterviewStageDTO> addInterviewStage(@PathVariable Long applicationId,
                                                               @Valid @RequestBody InterviewStageDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewService.addInterviewStage(applicationId, dto));
    }

    @PatchMapping("/{stageId}/result")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InterviewStageDTO> recordResult(@PathVariable Long stageId,
                                                          @RequestBody StatusUpdateRequest request) {
        InterviewStatus status = InterviewStatus.valueOf(request.getStatus().toUpperCase());
        return ResponseEntity.ok(interviewService.recordResult(stageId, status, request.getRemarks()));
    }

    @DeleteMapping("/{stageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStage(@PathVariable Long stageId) {
        interviewService.deleteStage(stageId);
        return ResponseEntity.noContent().build();
    }
}
