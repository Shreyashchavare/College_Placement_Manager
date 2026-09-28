package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.Placement;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlacementDTO {
    private Long id;
    private Long studentId;
    private String studentRollNumber;
    private String studentFullName;
    private String studentDepartment;

    private Long placementDriveId;
    private String driveTitle;
    private String jobRole;

    private Long companyId;
    private String companyName;

    private Double packageLpa;
    private LocalDate offerDate;
    private String status;
    private LocalDateTime createdAt;

    public PlacementDTO() {}

    public static PlacementDTO fromEntity(Placement placement) {
        if (placement == null) return null;
        PlacementDTO dto = new PlacementDTO();
        dto.setId(placement.getId());

        if (placement.getStudent() != null) {
            dto.setStudentId(placement.getStudent().getId());
            dto.setStudentRollNumber(placement.getStudent().getRollNumber());
            dto.setStudentFullName(placement.getStudent().getFullName());
            dto.setStudentDepartment(placement.getStudent().getDepartment());
        }

        if (placement.getPlacementDrive() != null) {
            dto.setPlacementDriveId(placement.getPlacementDrive().getId());
            dto.setDriveTitle(placement.getPlacementDrive().getTitle());
            dto.setJobRole(placement.getPlacementDrive().getJobRole());
        }

        if (placement.getCompany() != null) {
            dto.setCompanyId(placement.getCompany().getId());
            dto.setCompanyName(placement.getCompany().getName());
        }

        dto.setPackageLpa(placement.getPackageLpa());
        dto.setOfferDate(placement.getOfferDate());
        dto.setStatus(placement.getStatus());
        dto.setCreatedAt(placement.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentRollNumber() {
        return studentRollNumber;
    }

    public void setStudentRollNumber(String studentRollNumber) {
        this.studentRollNumber = studentRollNumber;
    }

    public String getStudentFullName() {
        return studentFullName;
    }

    public void setStudentFullName(String studentFullName) {
        this.studentFullName = studentFullName;
    }

    public String getStudentDepartment() {
        return studentDepartment;
    }

    public void setStudentDepartment(String studentDepartment) {
        this.studentDepartment = studentDepartment;
    }

    public Long getPlacementDriveId() {
        return placementDriveId;
    }

    public void setPlacementDriveId(Long placementDriveId) {
        this.placementDriveId = placementDriveId;
    }

    public String getDriveTitle() {
        return driveTitle;
    }

    public void setDriveTitle(String driveTitle) {
        this.driveTitle = driveTitle;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
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

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public LocalDate getOfferDate() {
        return offerDate;
    }

    public void setOfferDate(LocalDate offerDate) {
        this.offerDate = offerDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
