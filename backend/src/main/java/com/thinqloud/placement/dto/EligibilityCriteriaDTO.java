package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.EligibilityCriteria;
import jakarta.validation.constraints.NotNull;

public class EligibilityCriteriaDTO {
    private Long id;
    private Long placementDriveId;
    private String allowedDepartments = "ALL";

    @NotNull(message = "Minimum CGPA is required")
    private Double minCgpa = 0.0;

    @NotNull(message = "Maximum backlogs is required")
    private Integer maxBacklogs = 0;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    public EligibilityCriteriaDTO() {}

    public static EligibilityCriteriaDTO fromEntity(EligibilityCriteria criteria) {
        if (criteria == null) return null;
        EligibilityCriteriaDTO dto = new EligibilityCriteriaDTO();
        dto.setId(criteria.getId());
        if (criteria.getPlacementDrive() != null) {
            dto.setPlacementDriveId(criteria.getPlacementDrive().getId());
        }
        dto.setAllowedDepartments(criteria.getAllowedDepartments());
        dto.setMinCgpa(criteria.getMinCgpa());
        dto.setMaxBacklogs(criteria.getMaxBacklogs());
        dto.setGraduationYear(criteria.getGraduationYear());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlacementDriveId() {
        return placementDriveId;
    }

    public void setPlacementDriveId(Long placementDriveId) {
        this.placementDriveId = placementDriveId;
    }

    public String getAllowedDepartments() {
        return allowedDepartments;
    }

    public void setAllowedDepartments(String allowedDepartments) {
        this.allowedDepartments = allowedDepartments;
    }

    public Double getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(Double minCgpa) {
        this.minCgpa = minCgpa;
    }

    public Integer getMaxBacklogs() {
        return maxBacklogs;
    }

    public void setMaxBacklogs(Integer maxBacklogs) {
        this.maxBacklogs = maxBacklogs;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }
}
