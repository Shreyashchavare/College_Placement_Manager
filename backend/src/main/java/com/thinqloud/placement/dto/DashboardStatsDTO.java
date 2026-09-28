package com.thinqloud.placement.dto;

import java.util.Map;

public class DashboardStatsDTO {
    private long totalStudents;
    private long totalCompanies;
    private long totalDrives;
    private long openDrives;
    private long totalApplications;
    private long totalPlaced;
    private Double averagePackageLpa;
    private Double highestPackageLpa;
    private Map<String, Long> applicationsByStatus;

    public DashboardStatsDTO() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getTotalDrives() {
        return totalDrives;
    }

    public void setTotalDrives(long totalDrives) {
        this.totalDrives = totalDrives;
    }

    public long getOpenDrives() {
        return openDrives;
    }

    public void setOpenDrives(long openDrives) {
        this.openDrives = openDrives;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalPlaced() {
        return totalPlaced;
    }

    public void setTotalPlaced(long totalPlaced) {
        this.totalPlaced = totalPlaced;
    }

    public Double getAveragePackageLpa() {
        return averagePackageLpa;
    }

    public void setAveragePackageLpa(Double averagePackageLpa) {
        this.averagePackageLpa = averagePackageLpa;
    }

    public Double getHighestPackageLpa() {
        return highestPackageLpa;
    }

    public void setHighestPackageLpa(Double highestPackageLpa) {
        this.highestPackageLpa = highestPackageLpa;
    }

    public Map<String, Long> getApplicationsByStatus() {
        return applicationsByStatus;
    }

    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) {
        this.applicationsByStatus = applicationsByStatus;
    }
}
