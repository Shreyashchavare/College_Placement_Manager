package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.Application;
import com.thinqloud.placement.entity.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ApplicationDTO {
    private Long id;
    private Long studentId;
    private String studentRollNumber;
    private String studentFullName;
    private String studentDepartment;
    private Double studentCgpa;
    private String studentEmail;
    private String studentPhone;

    private Long placementDriveId;
    private String driveTitle;
    private String jobRole;
    private Double packageLpa;
    private String companyName;

    private ApplicationStatus status = ApplicationStatus.APPLIED;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private String remarks;

    private List<InterviewStageDTO> interviewStages = new ArrayList<>();

    public ApplicationDTO() {}

    public static ApplicationDTO fromEntity(Application app) {
        if (app == null) return null;
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(app.getId());

        if (app.getStudent() != null) {
            dto.setStudentId(app.getStudent().getId());
            dto.setStudentRollNumber(app.getStudent().getRollNumber());
            dto.setStudentFullName(app.getStudent().getFullName());
            dto.setStudentDepartment(app.getStudent().getDepartment());
            dto.setStudentCgpa(app.getStudent().getCgpa());
            dto.setStudentPhone(app.getStudent().getPhone());
            if (app.getStudent().getUser() != null) {
                dto.setStudentEmail(app.getStudent().getUser().getEmail());
            }
        }

        if (app.getPlacementDrive() != null) {
            dto.setPlacementDriveId(app.getPlacementDrive().getId());
            dto.setDriveTitle(app.getPlacementDrive().getTitle());
            dto.setJobRole(app.getPlacementDrive().getJobRole());
            dto.setPackageLpa(app.getPlacementDrive().getPackageLpa());
            if (app.getPlacementDrive().getCompany() != null) {
                dto.setCompanyName(app.getPlacementDrive().getCompany().getName());
            }
        }

        dto.setStatus(app.getStatus());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        dto.setRemarks(app.getRemarks());

        if (app.getInterviewStages() != null) {
            dto.setInterviewStages(app.getInterviewStages().stream()
                    .map(InterviewStageDTO::fromEntity)
                    .collect(Collectors.toList()));
        }

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

    public Double getStudentCgpa() {
        return studentCgpa;
    }

    public void setStudentCgpa(Double studentCgpa) {
        this.studentCgpa = studentCgpa;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentPhone() {
        return studentPhone;
    }

    public void setStudentPhone(String studentPhone) {
        this.studentPhone = studentPhone;
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

    public Double getPackageLpa() {
        return packageLpa;
    }

    public void setPackageLpa(Double packageLpa) {
        this.packageLpa = packageLpa;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<InterviewStageDTO> getInterviewStages() {
        return interviewStages;
    }

    public void setInterviewStages(List<InterviewStageDTO> interviewStages) {
        this.interviewStages = interviewStages;
    }
}
