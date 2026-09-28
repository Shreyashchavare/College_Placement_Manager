# System Architecture — College Placement Manager

## 1. High-Level Architecture Diagram

```
+-------------------------------------------------------------+
|                      React Single Page App                  |
|  - Admin Dashboard (Drives, Applications, Interviews, Placed)|
|  - Student Dashboard (Available Drives, Eligibility, Apply) |
+------------------------------+------------------------------+
                               | HTTPS / JSON (Bearer JWT)
                               v
+-------------------------------------------------------------+
|               Spring Boot Layered Monolith                  |
|                                                             |
|  [Security Filter Chain] -> JwtAuthenticationFilter         |
|                                                             |
|  [REST Controllers]                                         |
|    - AuthController        (/api/auth/**)                   |
|    - StudentController     (/api/students/**)               |
|    - CompanyController     (/api/companies/**)              |
|    - PlacementDriveController (/api/drives/**)              |
|    - ApplicationController (/api/applications/**)          |
|    - InterviewController   (/api/interviews/**)             |
|    - DashboardController   (/api/dashboard/**)              |
|                                                             |
|  [Service Layer (Business Logic & Eligibility Engine)]      |
|    - AuthService, StudentService, CompanyService            |
|    - PlacementDriveService, EligibilityEngine               |
|    - ApplicationService, InterviewService, PlacementService |
|                                                             |
|  [Repositories (Spring Data JPA)]                           |
|    - UserRepository, StudentRepository, CompanyRepository   |
|    - PlacementDriveRepository, ApplicationRepository        |
|    - InterviewStageRepository, PlacementRepository          |
+------------------------------+------------------------------+
                               | JDBC
                               v
+-------------------------------------------------------------+
|                   PostgreSQL Database                       |
|  Tables: users, students, companies, placement_drives,      |
|  eligibility_criteria, applications, interview_stages,      |
|  placements                                                 |
+-------------------------------------------------------------+
```

---

## 2. Core Domain Entities & Relationships

1. **User (`users`)**:
   - `id`: Long (PK)
   - `email`: String (Unique)
   - `password`: String (Bcrypt hashed)
   - `role`: Enum (`ADMIN`, `STUDENT`)
   - `createdAt`: Timestamp

2. **Student (`students`)**:
   - `id`: Long (PK)
   - `user_id`: Long (FK -> `users.id`, Unique)
   - `rollNumber`: String (Unique)
   - `fullName`: String
   - `department`: String (e.g. `CSE`, `IT`, `ECE`, `MECH`, `CIVIL`)
   - `cgpa`: Double
   - `activeBacklogs`: Integer
   - `graduationYear`: Integer
   - `phone`: String
   - `skills`: String
   - `resumeUrl`: String

3. **Company (`companies`)**:
   - `id`: Long (PK)
   - `name`: String
   - `industry`: String
   - `website`: String
   - `contactEmail`: String
   - `contactPhone`: String
   - `location`: String
   - `description`: Text

4. **PlacementDrive (`placement_drives`)**:
   - `id`: Long (PK)
   - `company_id`: Long (FK -> `companies.id`)
   - `title`: String
   - `jobRole`: String
   - `jobDescription`: Text
   - `packageLpa`: Double (e.g. 12.5)
   - `location`: String
   - `deadline`: LocalDate / LocalDateTime
   - `driveDate`: LocalDate
   - `status`: Enum (`DRAFT`, `OPEN`, `CLOSED`)

5. **EligibilityCriteria (`eligibility_criteria`)**:
   - `id`: Long (PK)
   - `placement_drive_id`: Long (FK -> `placement_drives.id`, Unique 1-to-1)
   - `allowedDepartments`: String (e.g. `CSE,IT,ECE` or `ALL`)
   - `minCgpa`: Double
   - `maxBacklogs`: Integer
   - `graduationYear`: Integer

6. **Application (`applications`)**:
   - `id`: Long (PK)
   - `student_id`: Long (FK -> `students.id`)
   - `placement_drive_id`: Long (FK -> `placement_drives.id`)
   - `status`: Enum (`APPLIED`, `SCREENING`, `INTERVIEW`, `SELECTED`, `REJECTED`)
   - `appliedAt`: LocalDateTime
   - `updatedAt`: LocalDateTime
   - `remarks`: String
   - **Unique Constraint:** `(student_id, placement_drive_id)`

7. **InterviewStage (`interview_stages`)**:
   - `id`: Long (PK)
   - `application_id`: Long (FK -> `applications.id`)
   - `roundName`: String (e.g. `Online Assessment`, `Technical Round 1`, `HR Round`)
   - `roundOrder`: Integer (1, 2, 3...)
   - `scheduledAt`: LocalDateTime
   - `status`: Enum (`PENDING`, `PASSED`, `FAILED`)
   - `feedback`: Text

8. **Placement (`placements`)**:
   - `id`: Long (PK)
   - `student_id`: Long (FK -> `students.id`)
   - `placement_drive_id`: Long (FK -> `placement_drives.id`)
   - `company_id`: Long (FK -> `companies.id`)
   - `packageLpa`: Double
   - `offerDate`: LocalDate
   - `status`: String (`ACCEPTED`, `OFFERED`)

---

## 3. State Transition Matrix

### Drive Lifecycle
- `DRAFT` -> `OPEN` (Published by Admin; eligible students can now apply)
- `OPEN` -> `CLOSED` (Closed by Admin or deadline passed; no new applications)

### Application Lifecycle
- `APPLIED` -> `SCREENING` (Shortlisting by Admin)
- `SCREENING` -> `INTERVIEW` (Moves to Interview rounds)
- `INTERVIEW` -> `SELECTED` (All rounds cleared; triggers auto-creation of `Placement`)
- `SCREENING` or `INTERVIEW` -> `REJECTED`

---

## 4. API Specification Summary

### Auth APIs
- `POST /api/auth/register` (Register student/user)
- `POST /api/auth/login` (Returns `{ token, role, email, studentId }`)
- `GET  /api/auth/me` (Returns current user profile)

### Student Management APIs
- `GET    /api/students` (Admin only — list students with filter)
- `GET    /api/students/{id}` (Admin or student self)
- `POST   /api/students` (Admin only — onboard student)
- `PUT    /api/students/{id}` (Update student profile)

### Company APIs
- `GET    /api/companies` (Admin and Student)
- `POST   /api/companies` (Admin only)
- `GET    /api/companies/{id}` (Admin and Student)
- `PUT    /api/companies/{id}` (Admin only)
- `DELETE /api/companies/{id}` (Admin only)

### Placement Drive APIs
- `GET    /api/drives` (List drives; student sees OPEN, admin sees all)
- `POST   /api/drives` (Admin: create drive with eligibility)
- `GET    /api/drives/{id}` (Get drive details + eligibility)
- `PUT    /api/drives/{id}` (Admin: update drive & eligibility)
- `PATCH  /api/drives/{id}/status` (Admin: change status `DRAFT`/`OPEN`/`CLOSED`)
- `GET    /api/drives/{id}/eligibility-check` (Student: check if currently logged-in student is eligible)
- `GET    /api/drives/{id}/eligible-students` (Admin: view all eligible students for this drive)

### Application APIs
- `POST   /api/applications/apply/{driveId}` (Student: apply to drive; validates eligibility & drive status)
- `GET    /api/applications/my-applications` (Student: view their applications)
- `GET    /api/applications/drive/{driveId}` (Admin: view all applications for a drive)
- `GET    /api/applications/{id}` (Admin / Applicant: get application details & interview rounds)
- `PATCH  /api/applications/{id}/status` (Admin: update application status)

### Interview APIs
- `POST   /api/interviews/application/{appId}` (Admin: schedule interview round)
- `PATCH  /api/interviews/{id}/result` (Admin: record PASSED/FAILED + feedback)
- `GET    /api/interviews/application/{appId}` (Get interview stages for application)

### Placement & Dashboard APIs
- `GET    /api/placements` (List final placements)
- `GET    /api/dashboard/stats` (Admin: summary metrics — Total Students, Companies, Open Drives, Applications, Placed Students, Average Package)
- `GET    /api/dashboard/student-stats` (Student: overview metrics)
