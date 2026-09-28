const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    if (response.status === 401) {
      // Unauthenticated -> trigger logout if needed
      // localStorage.removeItem('token');
    }
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Students
  getStudents: () => request('/students'),
  getStudentById: (id) => request(`/students/${id}`),
  createStudent: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: 'DELETE' }),

  // Companies
  getCompanies: () => request('/companies'),
  getCompanyById: (id) => request(`/companies/${id}`),
  createCompany: (data) => request('/companies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id, data) => request(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCompany: (id) => request(`/companies/${id}`, { method: 'DELETE' }),

  // Placement Drives
  getDrives: () => request('/drives'),
  getOpenDrives: () => request('/drives/open'),
  getDriveById: (id) => request(`/drives/${id}`),
  createDrive: (data) => request('/drives', { method: 'POST', body: JSON.stringify(data) }),
  updateDrive: (id, data) => request(`/drives/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateDriveStatus: (id, status) => request(`/drives/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  checkEligibility: (driveId, studentId) => request(`/drives/${driveId}/eligibility-check/${studentId}`),
  getEligibleStudents: (driveId) => request(`/drives/${driveId}/eligible-students`),
  deleteDrive: (id) => request(`/drives/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: () => request('/applications'),
  getApplicationsByDrive: (driveId) => request(`/applications/drive/${driveId}`),
  getMyApplications: (studentId) => request(`/applications/student/${studentId}`),
  getApplicationById: (id) => request(`/applications/${id}`),
  applyForDrive: (driveId, studentId) => request(`/applications/apply/${driveId}/student/${studentId}`, { method: 'POST' }),
  updateApplicationStatus: (id, status, remarks) => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),
  selectCandidate: (id, remarks) => request(`/applications/${id}/select`, { method: 'POST', body: JSON.stringify({ remarks }) }),
  rejectCandidate: (id, remarks) => request(`/applications/${id}/reject`, { method: 'POST', body: JSON.stringify({ remarks }) }),

  // Interviews
  getInterviewsByApplication: (appId) => request(`/interviews/application/${appId}`),
  addInterviewStage: (appId, data) => request(`/interviews/application/${appId}`, { method: 'POST', body: JSON.stringify(data) }),
  recordInterviewResult: (stageId, status, remarks) => request(`/interviews/${stageId}/result`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),
  deleteInterviewStage: (stageId) => request(`/interviews/${stageId}`, { method: 'DELETE' }),

  // Placements
  getPlacements: () => request('/placements'),
  getPlacementsByStudent: (studentId) => request(`/placements/student/${studentId}`),

  // Dashboard
  getAdminDashboard: () => request('/dashboard/admin'),
  getStudentDashboard: (studentId) => request(`/dashboard/student/${studentId}`),
};
