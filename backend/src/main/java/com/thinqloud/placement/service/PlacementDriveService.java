package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.EligibilityCheckResultDTO;
import com.thinqloud.placement.dto.EligibilityCriteriaDTO;
import com.thinqloud.placement.dto.PlacementDriveDTO;
import com.thinqloud.placement.dto.StudentDTO;
import com.thinqloud.placement.entity.*;
import com.thinqloud.placement.exception.BusinessException;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.ApplicationRepository;
import com.thinqloud.placement.repository.CompanyRepository;
import com.thinqloud.placement.repository.PlacementDriveRepository;
import com.thinqloud.placement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;

    public PlacementDriveService(PlacementDriveRepository driveRepository,
                                 CompanyRepository companyRepository,
                                 StudentRepository studentRepository,
                                 ApplicationRepository applicationRepository) {
        this.driveRepository = driveRepository;
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<PlacementDriveDTO> getAllDrives() {
        return driveRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::populateDriveDTO)
                .collect(Collectors.toList());
    }

    public List<PlacementDriveDTO> getOpenDrives() {
        return driveRepository.findByStatusOrderByCreatedAtDesc(DriveStatus.OPEN).stream()
                .map(this::populateDriveDTO)
                .collect(Collectors.toList());
    }

    public PlacementDriveDTO getDriveById(Long id) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));
        return populateDriveDTO(drive);
    }

    @Transactional
    public PlacementDriveDTO createDrive(PlacementDriveDTO dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        PlacementDrive drive = new PlacementDrive();
        drive.setCompany(company);
        drive.setTitle(dto.getTitle());
        drive.setJobRole(dto.getJobRole());
        drive.setJobDescription(dto.getJobDescription());
        drive.setPackageLpa(dto.getPackageLpa());
        drive.setLocation(dto.getLocation());
        drive.setDeadline(dto.getDeadline());
        drive.setDriveDate(dto.getDriveDate());
        drive.setStatus(dto.getStatus() != null ? dto.getStatus() : DriveStatus.DRAFT);

        EligibilityCriteria criteria = new EligibilityCriteria();
        if (dto.getEligibilityCriteria() != null) {
            EligibilityCriteriaDTO cDto = dto.getEligibilityCriteria();
            criteria.setAllowedDepartments(cDto.getAllowedDepartments() != null ? cDto.getAllowedDepartments() : "ALL");
            criteria.setMinCgpa(cDto.getMinCgpa() != null ? cDto.getMinCgpa() : 0.0);
            criteria.setMaxBacklogs(cDto.getMaxBacklogs() != null ? cDto.getMaxBacklogs() : 0);
            criteria.setGraduationYear(cDto.getGraduationYear() != null ? cDto.getGraduationYear() : 2026);
        } else {
            criteria.setAllowedDepartments("ALL");
            criteria.setMinCgpa(6.0);
            criteria.setMaxBacklogs(0);
            criteria.setGraduationYear(2026);
        }

        drive.setEligibilityCriteria(criteria);
        drive = driveRepository.save(drive);

        return populateDriveDTO(drive);
    }

    @Transactional
    public PlacementDriveDTO updateDrive(Long id, PlacementDriveDTO dto) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));

        if (dto.getCompanyId() != null && !dto.getCompanyId().equals(drive.getCompany().getId())) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));
            drive.setCompany(company);
        }

        drive.setTitle(dto.getTitle());
        drive.setJobRole(dto.getJobRole());
        drive.setJobDescription(dto.getJobDescription());
        drive.setPackageLpa(dto.getPackageLpa());
        drive.setLocation(dto.getLocation());
        drive.setDeadline(dto.getDeadline());
        drive.setDriveDate(dto.getDriveDate());
        if (dto.getStatus() != null) {
            drive.setStatus(dto.getStatus());
        }

        if (dto.getEligibilityCriteria() != null) {
            EligibilityCriteria criteria = drive.getEligibilityCriteria();
            if (criteria == null) {
                criteria = new EligibilityCriteria();
                criteria.setPlacementDrive(drive);
            }
            EligibilityCriteriaDTO cDto = dto.getEligibilityCriteria();
            criteria.setAllowedDepartments(cDto.getAllowedDepartments() != null ? cDto.getAllowedDepartments() : "ALL");
            criteria.setMinCgpa(cDto.getMinCgpa() != null ? cDto.getMinCgpa() : 0.0);
            criteria.setMaxBacklogs(cDto.getMaxBacklogs() != null ? cDto.getMaxBacklogs() : 0);
            criteria.setGraduationYear(cDto.getGraduationYear() != null ? cDto.getGraduationYear() : 2026);
            drive.setEligibilityCriteria(criteria);
        }

        drive = driveRepository.save(drive);
        return populateDriveDTO(drive);
    }

    @Transactional
    public PlacementDriveDTO updateDriveStatus(Long id, DriveStatus status) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));
        drive.setStatus(status);
        drive = driveRepository.save(drive);
        return populateDriveDTO(drive);
    }

    @Transactional
    public void deleteDrive(Long id) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));
        driveRepository.delete(drive);
    }

    // Eligibility Evaluation Engine
    public EligibilityCheckResultDTO checkStudentEligibility(Long driveId, Long studentId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + driveId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        EligibilityCheckResultDTO result = new EligibilityCheckResultDTO();
        EligibilityCriteria criteria = drive.getEligibilityCriteria();

        // Check if student already applied
        boolean alreadyApplied = applicationRepository.existsByStudentIdAndPlacementDriveId(studentId, driveId);
        result.setAlreadyApplied(alreadyApplied);

        if (criteria == null) {
            result.setEligible(true);
            result.setDepartmentEligible(true);
            result.setCgpaEligible(true);
            result.setBacklogsEligible(true);
            result.setGradYearEligible(true);
            return result;
        }

        // 1. Department Check
        boolean deptOk = false;
        if (criteria.getAllowedDepartments().equalsIgnoreCase("ALL")) {
            deptOk = true;
        } else {
            List<String> allowed = Arrays.stream(criteria.getAllowedDepartments().split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .collect(Collectors.toList());
            if (student.getDepartment() != null && allowed.contains(student.getDepartment().toUpperCase())) {
                deptOk = true;
            }
        }
        result.setDepartmentEligible(deptOk);
        if (!deptOk) {
            result.getReasons().add("Department '" + student.getDepartment() + "' is not eligible. Allowed: " + criteria.getAllowedDepartments());
        }

        // 2. CGPA Check
        boolean cgpaOk = (student.getCgpa() != null && student.getCgpa() >= criteria.getMinCgpa());
        result.setCgpaEligible(cgpaOk);
        if (!cgpaOk) {
            result.getReasons().add("CGPA " + student.getCgpa() + " is below minimum required " + criteria.getMinCgpa());
        }

        // 3. Backlogs Check
        boolean backlogsOk = (student.getActiveBacklogs() != null && student.getActiveBacklogs() <= criteria.getMaxBacklogs());
        result.setBacklogsEligible(backlogsOk);
        if (!backlogsOk) {
            result.getReasons().add("Active backlogs (" + student.getActiveBacklogs() + ") exceeds maximum allowed (" + criteria.getMaxBacklogs() + ")");
        }

        // 4. Graduation Year Check
        boolean gradYearOk = (student.getGraduationYear() != null && student.getGraduationYear().equals(criteria.getGraduationYear()));
        result.setGradYearEligible(gradYearOk);
        if (!gradYearOk) {
            result.getReasons().add("Graduation year " + student.getGraduationYear() + " does not match required " + criteria.getGraduationYear());
        }

        boolean allEligible = deptOk && cgpaOk && backlogsOk && gradYearOk;
        result.setEligible(allEligible);

        return result;
    }

    public List<StudentDTO> getEligibleStudentsForDrive(Long driveId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + driveId));
        EligibilityCriteria criteria = drive.getEligibilityCriteria();

        List<Student> allStudents = studentRepository.findAll();
        if (criteria == null) {
            return allStudents.stream().map(StudentDTO::fromEntity).collect(Collectors.toList());
        }

        return allStudents.stream()
                .filter(student -> {
                    EligibilityCheckResultDTO res = checkStudentEligibility(driveId, student.getId());
                    return res.isEligible();
                })
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private PlacementDriveDTO populateDriveDTO(PlacementDrive drive) {
        PlacementDriveDTO dto = PlacementDriveDTO.fromEntity(drive);
        long count = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(drive.getId()).size();
        dto.setTotalApplications(count);
        return dto;
    }
}
