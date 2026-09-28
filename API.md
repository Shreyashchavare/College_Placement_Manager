# REST API Documentation — College Placement Manager

Base URL: `http://localhost:8080/api`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT bearer token.
- **Request Body:**
```json
{
  "email": "admin@placement.com",
  "password": "Admin@123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "admin@placement.com",
  "role": "ROLE_ADMIN",
  "studentId": null,
  "fullName": "Placement Officer (Admin)"
}
```

### `POST /api/auth/register`
Registers a new student user.
- **Request Body:**
```json
{
  "email": "david.cse@placement.com",
  "password": "Student@123",
  "role": "ROLE_STUDENT",
  "rollNumber": "2026CS110",
  "fullName": "David Clark",
  "department": "CSE",
  "cgpa": 8.4,
  "activeBacklogs": 0,
  "graduationYear": 2026,
  "phone": "+91 9876543299",
  "skills": "Java, Spring, React"
}
```

---

## 2. Students (`/api/students`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/students` | Admin | List all registered students |
| `GET` | `/api/students/{id}` | Admin / Student | Get student profile by ID |
| `POST` | `/api/students` | Admin | Onboard a new student record |
| `PUT` | `/api/students/{id}` | Admin / Student | Update student profile |
| `DELETE` | `/api/students/{id}` | Admin | Delete student record |

---

## 3. Companies (`/api/companies`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/companies` | Public / Auth | List all recruiting partner companies |
| `GET` | `/api/companies/{id}` | Auth | Get company profile details |
| `POST` | `/api/companies` | Admin | Create corporate partner |
| `PUT` | `/api/companies/{id}` | Admin | Update company profile |
| `DELETE` | `/api/companies/{id}` | Admin | Delete company |

---

## 4. Placement Drives (`/api/drives`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/drives` | Admin | List all placement drives (including DRAFT, CLOSED) |
| `GET` | `/api/drives/open` | Auth | List open placement drives accepting applications |
| `GET` | `/api/drives/{id}` | Auth | Get drive details + eligibility rules |
| `POST` | `/api/drives` | Admin | Launch new drive with custom eligibility |
| `PUT` | `/api/drives/{id}` | Admin | Update drive information and criteria |
| `PATCH` | `/api/drives/{id}/status` | Admin | Update status (`DRAFT`, `OPEN`, `CLOSED`) |
| `GET` | `/api/drives/{id}/eligibility-check/{studentId}` | Auth | Check real-time qualification for a student |
| `GET` | `/api/drives/{id}/eligible-students` | Admin | Calculate all students meeting drive criteria |

---

## 5. Applications Pipeline (`/api/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/applications` | Admin | View all submitted candidate applications |
| `GET` | `/api/applications/drive/{driveId}` | Admin | View applications for a specific drive |
| `GET` | `/api/applications/student/{studentId}` | Student | View current student's submitted applications |
| `GET` | `/api/applications/{id}` | Auth | Get full application details with interview stages |
| `POST` | `/api/applications/apply/{driveId}/student/{studentId}` | Student | Submit application (validates eligibility) |
| `PATCH` | `/api/applications/{id}/status` | Admin | Update status (`SCREENING`, `INTERVIEW`) |
| `POST` | `/api/applications/{id}/select` | Admin | Select candidate (auto-creates placement) |
| `POST` | `/api/applications/{id}/reject` | Admin | Reject application with feedback |

---

## 6. Interview Rounds (`/api/interviews`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/interviews/application/{appId}` | Auth | List interview rounds for an application |
| `POST` | `/api/interviews/application/{appId}` | Admin | Schedule a new interview round |
| `PATCH` | `/api/interviews/{stageId}/result` | Admin | Record round result (`PASSED`/`FAILED`) and feedback |
| `DELETE` | `/api/interviews/{stageId}` | Admin | Remove scheduled round |

---

## 7. Placements & Analytics (`/api/placements`, `/api/dashboard`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/placements` | Auth | List all confirmed placement offers |
| `GET` | `/api/placements/student/{studentId}` | Student | List placement offers for specific student |
| `GET` | `/api/dashboard/admin` | Admin | Summary metrics (students, drives, placed, avg package) |
| `GET` | `/api/dashboard/student/{studentId}` | Student | Summary counts for logged-in student |
