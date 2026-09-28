package com.thinqloud.placement.dto;

import com.thinqloud.placement.entity.Role;
import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String email;
    private Role role;
    private Long studentId;
    private String fullName;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String email, Role role, Long studentId, String fullName, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.studentId = studentId;
        this.fullName = fullName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
