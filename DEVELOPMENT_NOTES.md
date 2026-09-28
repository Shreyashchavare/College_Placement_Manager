# Development Notes — College Placement Manager

## 1. Project Context & Objectives
- **Assessment:** Thinqloud Solutions Campus Hiring Assessment
- **Topic:** College Placement Manager
- **Scope:** Manage students, companies, eligibility, applications, interview stages, and final selections.
- **Deadline Target:** 3–4 Hours
- **Strategy:** Clean layered monolithic backend (Spring Boot 3 + PostgreSQL) + responsive SPA frontend (React + Vite).

---

## 2. Project Assumptions & Design Decisions
The following are recorded as **PROJECT ASSUMPTIONS**:
1. **Roles:**
   - `ADMIN`: Placement Coordinator / Placement Cell Officer. Full access to manage students, companies, drives, eligibility, applications, interview rounds, and selections.
   - `STUDENT`: Campus candidate. Can view profile, view published placement drives, check real-time eligibility, apply for eligible drives, track application lifecycle, and view interview/selection results.
2. **Eligibility Criteria Attributes:**
   - `targetDepartment`: String/Comma-separated or list (e.g. `CSE, IT, ECE` or `ALL`).
   - `minCgpa`: Double (e.g. `7.0`).
   - `maxBacklogs`: Integer (e.g. `0` or `1`).
   - `graduationYear`: Integer (e.g. `2025` or `2026`).
3. **State Machines:**
   - **Placement Drive Status:** `DRAFT` -> `OPEN` -> `CLOSED`.
   - **Application Status:** `APPLIED` -> `SCREENING` -> `INTERVIEW` -> `SELECTED` / `REJECTED`.
   - **Interview Stage Status:** `PENDING` -> `PASSED` / `FAILED`.
4. **Placement Record Creation:**
   - When an application status transitions to `SELECTED`, a `Placement` record is automatically created (or updated) linking the student, company, drive, package (CTC), and offer date.

---

## 3. Tech Stack
- **Backend:** Java 21, Spring Boot 3.4.x, Spring Data JPA, Hibernate, Spring Security, JWT (jjwt), Maven.
- **Database:** PostgreSQL (Database: `placement_db`, port 5432).
- **Frontend:** React 18 / Vite, Tailwind CSS / clean modern responsive CSS.
- **Communication:** RESTful JSON APIs with standard HTTP status codes and centralized Exception Handler (`@RestControllerAdvice`).
