package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.InterviewStage;
import com.thinqloud.placement.entity.InterviewStatus;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class InterviewStageDTO {
    private Long id;
    private Long applicationId;

    @NotBlank(message = "Round name is required")
    private String roundName;

    private Integer roundOrder = 1;
    private LocalDateTime scheduledAt;
    private InterviewStatus status = InterviewStatus.PENDING;
    private String feedback;
    private LocalDateTime createdAt;

    public InterviewStageDTO() {}

    public static InterviewStageDTO fromEntity(InterviewStage stage) {
        if (stage == null) return null;
        InterviewStageDTO dto = new InterviewStageDTO();
        dto.setId(stage.getId());
        if (stage.getApplication() != null) {
            dto.setApplicationId(stage.getApplication().getId());
        }
        dto.setRoundName(stage.getRoundName());
        dto.setRoundOrder(stage.getRoundOrder());
        dto.setScheduledAt(stage.getScheduledAt());
        dto.setStatus(stage.getStatus());
        dto.setFeedback(stage.getFeedback());
        dto.setCreatedAt(stage.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getRoundName() {
        return roundName;
    }

    public void setRoundName(String roundName) {
        this.roundName = roundName;
    }

    public Integer getRoundOrder() {
        return roundOrder;
    }

    public void setRoundOrder(Integer roundOrder) {
        this.roundOrder = roundOrder;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
