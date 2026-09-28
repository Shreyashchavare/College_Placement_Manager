import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Briefcase, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Edit2, 
  Trash2, 
  X, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export function DrivesView() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEligibleModal, setShowEligibleModal] = useState(false);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedDriveForEligible, setSelectedDriveForEligible] = useState(null);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    jobRole: '',
    jobDescription: '',
    packageLpa: 8.0,
    location: '',
    deadline: '',
    driveDate: '',
    status: 'OPEN',
    allowedDepartments: 'ALL',
    minCgpa: 6.5,
    maxBacklogs: 0,
    graduationYear: 2026,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const [drivesData, companiesData] = await Promise.all([
        api.getDrives(),
        api.getCompanies()
      ]);
      setDrives(drivesData);
      setCompanies(companiesData);
      if (companiesData.length > 0 && !formData.companyId) {
        setFormData(prev => ({ ...prev, companyId: companiesData[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleOpenAdd = () => {
    setEditingDrive(null);
    setFormData({
      companyId: companies.length > 0 ? companies[0].id : '',
      title: '',
      jobRole: '',
      jobDescription: '',
      packageLpa: 10.0,
      location: 'Pune / Bangalore',
      deadline: '2026-10-15',
      driveDate: '2026-10-25',
      status: 'OPEN',
      allowedDepartments: 'CSE,IT',
      minCgpa: 7.0,
      maxBacklogs: 0,
      graduationYear: 2026,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingDrive(drive);
    setFormData({
      companyId: drive.companyId,
      title: drive.title,
      jobRole: drive.jobRole,
      jobDescription: drive.jobDescription || '',
      packageLpa: drive.packageLpa,
      location: drive.location || '',
      deadline: drive.deadline || '',
      driveDate: drive.driveDate || '',
      status: drive.status,
      allowedDepartments: drive.eligibilityCriteria?.allowedDepartments || 'ALL',
      minCgpa: drive.eligibilityCriteria?.minCgpa || 6.0,
      maxBacklogs: drive.eligibilityCriteria?.maxBacklogs || 0,
      graduationYear: drive.eligibilityCriteria?.graduationYear || 2026,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      companyId: parseInt(formData.companyId),
      title: formData.title,
      jobRole: formData.jobRole,
      jobDescription: formData.jobDescription,
      packageLpa: parseFloat(formData.packageLpa),
      location: formData.location,
      deadline: formData.deadline || null,
      driveDate: formData.driveDate || null,
      status: formData.status,
      eligibilityCriteria: {
        allowedDepartments: formData.allowedDepartments,
        minCgpa: parseFloat(formData.minCgpa),
        maxBacklogs: parseInt(formData.maxBacklogs),
        graduationYear: parseInt(formData.graduationYear),
      }
    };

    try {
      if (editingDrive) {
        await api.updateDrive(editingDrive.id, payload);
      } else {
        await api.createDrive(payload);
      }
      setShowModal(false);
      fetchDrives();
    } catch (err) {
      setError(err.message || 'Failed to save drive');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateDriveStatus(id, newStatus);
      fetchDrives();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleViewEligible = async (drive) => {
    setSelectedDriveForEligible(drive);
    try {
      const eligible = await api.getEligibleStudents(drive.id);
      setEligibleStudents(eligible);
      setShowEligibleModal(true);
    } catch (err) {
      alert(err.message || 'Failed to calculate eligible students');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;
    try {
      await api.deleteDrive(id);
      fetchDrives();
    } catch (err) {
      alert(err.message || 'Failed to delete drive');
    }
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Placement Drives</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Configure company drives, eligibility rules, and application windows.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Create Placement Drive</span>
        </button>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {/* Drives List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading placement drives...</div>
        ) : drives.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No placement drives created yet. Click "Create Placement Drive" to get started.
          </div>
        ) : (
          drives.map((d) => (
            <div key={d.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${d.status.toLowerCase()}`}>
                      {d.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {d.companyName}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{d.title}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Role: {d.jobRole}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '700px' }}>
                    {d.jobDescription}
                  </p>

                  {/* Highlights Grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <DollarSign size={16} color="#059669" />
                      <strong style={{ color: '#0f172a' }}>{d.packageLpa} LPA</strong>
                    </div>
                    {d.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={16} className="text-muted" /> {d.location}
                      </div>
                    )}
                    {d.deadline && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={16} className="text-muted" /> Deadline: {d.deadline}
                      </div>
                    )}
                  </div>
                </div>

                {/* Eligibility Summary Box & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', minWidth: '220px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={14} color="#4f46e5" /> Eligibility Criteria
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                      Dept: <strong>{d.eligibilityCriteria?.allowedDepartments || 'ALL'}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                      Min CGPA: <strong>{d.eligibilityCriteria?.minCgpa || 0}</strong> | Backlogs: &le; <strong>{d.eligibilityCriteria?.maxBacklogs || 0}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                      Batch: <strong>{d.eligibilityCriteria?.graduationYear || '2026'}</strong>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleViewEligible(d)} className="btn btn-outline btn-sm" title="View students eligible under these rules">
                      <Users size={14} />
                      <span>Eligible Pool</span>
                    </button>

                    {d.status === 'DRAFT' && (
                      <button onClick={() => handleStatusChange(d.id, 'OPEN')} className="btn btn-success btn-sm">
                        <CheckCircle size={14} />
                        <span>Publish Drive</span>
                      </button>
                    )}

                    {d.status === 'OPEN' && (
                      <button onClick={() => handleStatusChange(d.id, 'CLOSED')} className="btn btn-danger btn-sm">
                        <XCircle size={14} />
                        <span>Close Drive</span>
                      </button>
                    )}

                    {d.status === 'CLOSED' && (
                      <button onClick={() => handleStatusChange(d.id, 'OPEN')} className="btn btn-outline btn-sm">
                        <CheckCircle size={14} />
                        <span>Reopen</span>
                      </button>
                    )}

                    <button onClick={() => handleOpenEdit(d)} className="btn btn-outline btn-sm" title="Edit Drive">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} title="Delete Drive">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Eligible Students Modal */}
      {showEligibleModal && selectedDriveForEligible && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="flex-between mb-4">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Eligible Candidates</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Drive: {selectedDriveForEligible.title} ({selectedDriveForEligible.companyName})
                </p>
              </div>
              <button onClick={() => setShowEligibleModal(false)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', color: '#475569' }}>
              <strong>Applied Criteria:</strong> Allowed: {selectedDriveForEligible.eligibilityCriteria?.allowedDepartments} | Min CGPA: {selectedDriveForEligible.eligibilityCriteria?.minCgpa} | Max Backlogs: {selectedDriveForEligible.eligibilityCriteria?.maxBacklogs} | Batch: {selectedDriveForEligible.eligibilityCriteria?.graduationYear}
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Dept</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudents.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>No students currently meet this drive's criteria.</td></tr>
                  ) : (
                    eligibleStudents.map((st) => (
                      <tr key={st.id}>
                        <td style={{ fontWeight: 700 }}>{st.rollNumber}</td>
                        <td>{st.fullName}</td>
                        <td><span className="badge badge-draft">{st.department}</span></td>
                        <td><strong style={{ color: '#059669' }}>{st.cgpa}</strong></td>
                        <td>{st.activeBacklogs}</td>
                        <td><span className="badge badge-passed">Eligible</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setShowEligibleModal(false)} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-between mb-4">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingDrive ? 'Edit Placement Drive' : 'Configure New Placement Drive'}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Recruiting Company *</label>
                <select
                  className="form-select"
                  required
                  value={formData.companyId}
                  onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.industry || 'Tech'})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Drive Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Graduate Software Engineer Campus Hiring 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Job Role *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. SDE-1 / Cloud Support"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Package (CTC in LPA) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    className="form-input"
                    placeholder="e.g. 10.5"
                    value={formData.packageLpa}
                    onChange={(e) => setFormData({ ...formData, packageLpa: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pune / Hybrid"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Brief overview of responsibilities and expectations..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                />
              </div>

              {/* Eligibility Criteria Sub-Form */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
                  Eligibility Criteria Configuration
                </h4>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Allowed Departments</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. CSE,IT or ALL"
                      value={formData.allowedDepartments}
                      onChange={(e) => setFormData({ ...formData, allowedDepartments: e.target.value })}
                    />
                    <small style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Use comma-separated codes or 'ALL'</small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="form-input"
                      value={formData.minCgpa}
                      onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Max Allowed Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={formData.maxBacklogs}
                      onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Graduation Year</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Saving...' : editingDrive ? 'Update Drive' : 'Launch Placement Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
