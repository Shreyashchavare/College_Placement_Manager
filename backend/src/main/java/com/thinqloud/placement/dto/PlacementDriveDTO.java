package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.DriveStatus;
import com.thinqloud.placement.entity.PlacementDrive;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlacementDriveDTO {
    private Long id;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private String companyName;
    private String companyLocation;

    @NotBlank(message = "Drive title is required")
    private String title;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    private String jobDescription;

    @NotNull(message = "Package LPA is required")
    private Double packageLpa;

    private String location;
    private LocalDate deadline;
    private LocalDate driveDate;
    private DriveStatus status = DriveStatus.DRAFT;

    private EligibilityCriteriaDTO eligibilityCriteria;
    private long totalApplications = 0;
    private LocalDateTime createdAt;

    public PlacementDriveDTO() {}

    public static PlacementDriveDTO fromEntity(PlacementDrive drive) {
        if (drive == null) return null;
        PlacementDriveDTO dto = new PlacementDriveDTO();
        dto.setId(drive.getId());
        if (drive.getCompany() != null) {
            dto.setCompanyId(drive.getCompany().getId());
            dto.setCompanyName(drive.getCompany().getName());
            dto.setCompanyLocation(drive.getCompany().getLocation());
        }
        dto.setTitle(drive.getTitle());
        dto.setJobRole(drive.getJobRole());
        dto.setJobDescription(drive.getJobDescription());
        dto.setPackageLpa(drive.getPackageLpa());
        dto.setLocation(drive.getLocation());
        dto.setDeadline(drive.getDeadline());
        dto.setDriveDate(drive.getDriveDate());
        dto.setStatus(drive.getStatus());
        if (drive.getEligibilityCriteria() != null) {
            dto.setEligibilityCriteria(EligibilityCriteriaDTO.fromEntity(drive.getEligibilityCriteria()));
        }
        dto.setCreatedAt(drive.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public LocalDate getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDate driveDate) {
        this.driveDate = driveDate;
    }

    public DriveStatus getStatus() {
        return status;
    }

    public void setStatus(DriveStatus status) {
        this.status = status;
    }

    public EligibilityCriteriaDTO getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(EligibilityCriteriaDTO eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
