package com.thinqloud.placement.service;

import com.thinqloud.placement.dto.AuthResponse;
import com.thinqloud.placement.dto.LoginRequest;
import com.thinqloud.placement.dto.RegisterRequest;
import com.thinqloud.placement.dto.UserResponse;
import com.thinqloud.placement.entity.Role;
import com.thinqloud.placement.entity.Student;
import com.thinqloud.placement.entity.User;
import com.thinqloud.placement.exception.BusinessException;
import com.thinqloud.placement.exception.ResourceNotFoundException;
import com.thinqloud.placement.repository.StudentRepository;
import com.thinqloud.placement.repository.UserRepository;
import com.thinqloud.placement.security.JwtUtils;
import com.thinqloud.placement.security.UserDetailsImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long studentId = null;
        String fullName = user.getEmail();

        if (user.getRole() == Role.ROLE_STUDENT) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                studentId = studentOpt.get().getId();
                fullName = studentOpt.get().getFullName();
            }
        } else {
            fullName = "Placement Officer (Admin)";
        }

        String token = jwtUtils.generateToken(userDetails, user.getRole().name(), studentId);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), studentId, fullName);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email is already registered: " + request.getEmail());
        }

        Role role = Role.ROLE_STUDENT;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
            role = Role.ROLE_ADMIN;
        }

        User user = new User(request.getEmail(), passwordEncoder.encode(request.getPassword()), role);
        user = userRepository.save(user);

        Long studentId = null;
        String fullName = user.getEmail();

        if (role == Role.ROLE_STUDENT) {
            if (request.getRollNumber() != null && studentRepository.existsByRollNumber(request.getRollNumber())) {
                throw new BusinessException("Roll number is already registered: " + request.getRollNumber());
            }

            Student student = new Student();
            student.setUser(user);
            student.setRollNumber(request.getRollNumber() != null ? request.getRollNumber() : "ROLL-" + user.getId());
            student.setFullName(request.getFullName() != null ? request.getFullName() : "Student " + user.getId());
            student.setDepartment(request.getDepartment() != null ? request.getDepartment() : "CSE");
            student.setCgpa(request.getCgpa() != null ? request.getCgpa() : 7.0);
            student.setActiveBacklogs(request.getActiveBacklogs() != null ? request.getActiveBacklogs() : 0);
            student.setGraduationYear(request.getGraduationYear() != null ? request.getGraduationYear() : 2026);
            student.setPhone(request.getPhone());
            student.setSkills(request.getSkills());

            student = studentRepository.save(student);
            studentId = student.getId();
            fullName = student.getFullName();
        }

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String token = jwtUtils.generateToken(userDetails, user.getRole().name(), studentId);

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), studentId, fullName);
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Long studentId = null;
        String fullName = user.getEmail();

        if (user.getRole() == Role.ROLE_STUDENT) {
            Optional<Student> student = studentRepository.findByUserId(user.getId());
            if (student.isPresent()) {
                studentId = student.get().getId();
                fullName = student.get().getFullName();
            }
        } else {
            fullName = "Placement Officer (Admin)";
        }

        return new UserResponse(user.getId(), user.getEmail(), user.getRole(), studentId, fullName, user.getCreatedAt());
    }
}
