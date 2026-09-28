package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.DashboardStatsDTO;
import com.thinqloud.placement.entity.Application;
import com.thinqloud.placement.entity.ApplicationStatus;
import com.thinqloud.placement.entity.DriveStatus;
import com.thinqloud.placement.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PlacementRepository placementRepository;

    public DashboardService(StudentRepository studentRepository,
                            CompanyRepository companyRepository,
                            PlacementDriveRepository driveRepository,
                            ApplicationRepository applicationRepository,
                            PlacementRepository placementRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.placementRepository = placementRepository;
    }

    public DashboardStatsDTO getAdminStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalCompanies(companyRepository.count());
        stats.setTotalDrives(driveRepository.count());
        stats.setOpenDrives(driveRepository.countByStatus(DriveStatus.OPEN));
        stats.setTotalApplications(applicationRepository.count());
        stats.setTotalPlaced(placementRepository.count());

        Double avgPkg = placementRepository.findAveragePackage();
        stats.setAveragePackageLpa(avgPkg != null ? Math.round(avgPkg * 100.0) / 100.0 : 0.0);

        Double highPkg = placementRepository.findHighestPackage();
        stats.setHighestPackageLpa(highPkg != null ? highPkg : 0.0);

        Map<String, Long> statusMap = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusMap.put(status.name(), applicationRepository.countByStatus(status));
        }
        stats.setApplicationsByStatus(statusMap);

        return stats;
    }

    public Map<String, Object> getStudentStats(Long studentId) {
        Map<String, Object> map = new HashMap<>();
        long openDrives = driveRepository.countByStatus(DriveStatus.OPEN);
        List<Application> myApps = applicationRepository.findByStudentIdOrderByAppliedAtDesc(studentId);
        long placedCount = placementRepository.findByStudentId(studentId).size();

        long inInterview = myApps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW)
                .count();

        map.put("openDrives", openDrives);
        map.put("myApplicationsCount", myApps.size());
        map.put("inInterviewCount", inInterview);
        map.put("placedCount", placedCount);

        return map;
    }
}
