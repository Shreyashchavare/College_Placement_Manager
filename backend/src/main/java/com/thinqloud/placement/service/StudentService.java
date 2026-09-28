package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.StudentDTO;
import com.thinqloud.placement.entity.Role;
import com.thinqloud.placement.entity.Student;
import com.thinqloud.placement.entity.User;
import com.thinqloud.placement.exception.BusinessException;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.StudentRepository;
import com.thinqloud.placement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return StudentDTO.fromEntity(student);
    }

    public StudentDTO getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
        return StudentDTO.fromEntity(student);
    }

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new BusinessException("Roll number already exists: " + dto.getRollNumber());
        }

        String email = (dto.getEmail() != null && !dto.getEmail().isBlank()) 
                ? dto.getEmail() 
                : dto.getRollNumber().toLowerCase() + "@placement.com";

        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("User email already exists: " + email);
        }

        User user = new User(email, passwordEncoder.encode("Student@123"), Role.ROLE_STUDENT);
        user = userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setRollNumber(dto.getRollNumber());
        student.setFullName(dto.getFullName());
        student.setDepartment(dto.getDepartment());
        student.setCgpa(dto.getCgpa());
        student.setActiveBacklogs(dto.getActiveBacklogs() != null ? dto.getActiveBacklogs() : 0);
        student.setGraduationYear(dto.getGraduationYear());
        student.setPhone(dto.getPhone());
        student.setSkills(dto.getSkills());
        student.setResumeUrl(dto.getResumeUrl());

        student = studentRepository.save(student);
        return StudentDTO.fromEntity(student);
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getRollNumber().equalsIgnoreCase(dto.getRollNumber()) 
                && studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new BusinessException("Roll number already in use: " + dto.getRollNumber());
        }

        student.setRollNumber(dto.getRollNumber());
        student.setFullName(dto.getFullName());
        student.setDepartment(dto.getDepartment());
        student.setCgpa(dto.getCgpa());
        student.setActiveBacklogs(dto.getActiveBacklogs() != null ? dto.getActiveBacklogs() : 0);
        student.setGraduationYear(dto.getGraduationYear());
        student.setPhone(dto.getPhone());
        student.setSkills(dto.getSkills());
        student.setResumeUrl(dto.getResumeUrl());

        student = studentRepository.save(student);
        return StudentDTO.fromEntity(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }
}
