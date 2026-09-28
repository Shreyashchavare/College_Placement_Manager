import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  ChevronRight, 
  Award, 
  User, 
  Briefcase, 
  X, 
  Check, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export function ApplicationsView() {
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriveId, setSelectedDriveId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Technical Interview',
    roundOrder: 1,
    scheduledAt: '',
  });
  const [feedbackModal, setFeedbackModal] = useState({ show: false, stageId: null, status: 'PASSED', remarks: '' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, drivesData] = await Promise.all([
        api.getApplications(),
        api.getDrives()
      ]);
      setApplications(appsData);
      setDrives(drivesData);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectApplication = async (app) => {
    try {
      const detailed = await api.getApplicationById(app.id);
      setSelectedApp(detailed);
    } catch (err) {
      setSelectedApp(app);
    }
  };

  const handleStatusChange = async (appId, newStatus, remarks) => {
    try {
      await api.updateApplicationStatus(appId, newStatus, remarks);
      fetchData();
      if (selectedApp && selectedApp.id === appId) {
        const detailed = await api.getApplicationById(appId);
        setSelectedApp(detailed);
      }
    } catch (err) {
      alert(err.message || 'Failed to update application status');
    }
  };

  const handleSelectCandidate = async (appId) => {
    const remarks = prompt('Enter final selection remarks (optional):', 'Selected in final interview rounds');
    if (remarks === null) return;
    try {
      await api.selectCandidate(appId, remarks);
      alert('Candidate SELECTED! Final placement offer record created automatically.');
      fetchData();
      if (selectedApp && selectedApp.id === appId) {
        const detailed = await api.getApplicationById(appId);
        setSelectedApp(detailed);
      }
    } catch (err) {
      alert(err.message || 'Failed to select candidate');
    }
  };

  const handleRejectCandidate = async (appId) => {
    const remarks = prompt('Enter rejection feedback (optional):', 'Did not meet technical bar');
    if (remarks === null) return;
    try {
      await api.rejectCandidate(appId, remarks);
      fetchData();
      if (selectedApp && selectedApp.id === appId) {
        const detailed = await api.getApplicationById(appId);
        setSelectedApp(detailed);
      }
    } catch (err) {
      alert(err.message || 'Failed to reject application');
    }
  };

  const handleAddInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    try {
      const payload = {
        roundName: interviewForm.roundName,
        roundOrder: parseInt(interviewForm.roundOrder),
        scheduledAt: interviewForm.scheduledAt ? `${interviewForm.scheduledAt}:00` : null,
        status: 'PENDING'
      };
      await api.addInterviewStage(selectedApp.id, payload);
      setShowInterviewModal(false);
      const detailed = await api.getApplicationById(selectedApp.id);
      setSelectedApp(detailed);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to schedule interview round');
    }
  };

  const handleRecordResult = async (e) => {
    e.preventDefault();
    try {
      await api.recordInterviewResult(feedbackModal.stageId, feedbackModal.status, feedbackModal.remarks);
      setFeedbackModal({ show: false, stageId: null, status: 'PASSED', remarks: '' });
      if (selectedApp) {
        const detailed = await api.getApplicationById(selectedApp.id);
        setSelectedApp(detailed);
      }
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to record result');
    }
  };

  const filtered = applications.filter(a => {
    const matchDrive = selectedDriveId === 'ALL' || a.placementDriveId === parseInt(selectedDriveId);
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchDrive && matchStatus;
  });

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Applications & Interview Pipeline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track candidates through screening, interview stages, and final hiring decisions.</p>
        </div>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card mb-4" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Placement Drive</label>
            <select
              className="form-select"
              value={selectedDriveId}
              onChange={(e) => setSelectedDriveId(e.target.value)}
            >
              <option value="ALL">All Placement Drives</option>
              {drives?.filter(Boolean).map(d => (
                <option key={d?.id} value={d?.id}>{d?.title} ({d?.companyName})</option>
              ))}
            </select>
          </div>

          <div style={{ width: '200px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">APPLIED</option>
              <option value="SCREENING">SCREENING</option>
              <option value="INTERVIEW">INTERVIEW</option>
              <option value="SELECTED">SELECTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Application List on Left, Detail & Interview Rounds on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Applications Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Drive / Company</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No applications found.</td></tr>
              ) : (
                filtered?.filter(Boolean).map((app) => (
                  <tr 
                    key={app?.id} 
                    style={{ cursor: 'pointer', background: selectedApp?.id === app?.id ? '#eef2ff' : 'inherit' }}
                    onClick={() => handleSelectApplication(app)}
                  >
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.studentFullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {app.studentRollNumber} &bull; {app.studentDepartment} ({app.studentCgpa} CGPA)
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.driveTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{app.companyName} &bull; ₹{app.packageLpa} LPA</div>
                    </td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm">
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column: Selected Application Detail Card */}
        {selectedApp && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: '80px' }}>
            <div className="flex-between mb-4">
              <div>
                <span className={`badge badge-${selectedApp.status.toLowerCase()}`}>
                  {selectedApp.status}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.35rem' }}>
                  {selectedApp.studentFullName}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Applying for: <strong>{selectedApp.driveTitle}</strong> ({selectedApp.companyName})
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            {/* Candidate Metadata Summary */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.875rem', marginBottom: '1.25rem', fontSize: '0.825rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>Roll No: <strong>{selectedApp.studentRollNumber}</strong></div>
              <div>Department: <strong>{selectedApp.studentDepartment}</strong></div>
              <div>CGPA: <strong style={{ color: '#059669' }}>{selectedApp.studentCgpa}</strong></div>
              <div>Phone: <strong>{selectedApp.studentPhone || 'N/A'}</strong></div>
            </div>

            {selectedApp.remarks && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.625rem 0.875rem', fontSize: '0.8rem', color: '#1e40af', marginBottom: '1.25rem' }}>
                <strong>Remarks:</strong> {selectedApp.remarks}
              </div>
            )}

            {/* Interview Stages Pipeline */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="flex-between mb-2">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interview Rounds & Evaluations</h4>
                <button 
                  onClick={() => {
                    const nextOrder = (selectedApp.interviewStages?.length || 0) + 1;
                    setInterviewForm({ roundName: `Round ${nextOrder}: Technical`, roundOrder: nextOrder, scheduledAt: '' });
                    setShowInterviewModal(true);
                  }} 
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Add Round</span>
                </button>
              </div>

              {(!selectedApp.interviewStages || selectedApp.interviewStages.length === 0) ? (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  No interview rounds scheduled yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedApp.interviewStages?.filter(Boolean).map((stage) => (
                    <div key={stage?.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.875rem', boxShadow: 'var(--shadow-sm)' }}>
                      <div className="flex-between mb-1">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                            {stage.roundOrder}
                          </span>
                          <strong style={{ fontSize: '0.875rem' }}>{stage.roundName}</strong>
                        </div>
                        <span className={`badge badge-${stage.status.toLowerCase()}`}>
                          {stage.status}
                        </span>
                      </div>

                      {stage.scheduledAt && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Scheduled: {stage.scheduledAt.replace('T', ' ')}
                        </div>
                      )}

                      {stage.feedback && (
                        <div style={{ fontSize: '0.8rem', color: '#334155', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.4rem' }}>
                          <em>"{stage.feedback}"</em>
                        </div>
                      )}

                      {/* Result Recording Action */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.6rem' }}>
                        <button
                          onClick={() => setFeedbackModal({ show: true, stageId: stage.id, status: 'PASSED', remarks: stage.feedback || '' })}
                          className="btn btn-success btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <Check size={12} />
                          <span>Record Result</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Decision Controls */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Application State Machine Actions
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedApp.status === 'APPLIED' && (
                  <button 
                    onClick={() => handleStatusChange(selectedApp.id, 'SCREENING', 'Shortlisted in initial screening')}
                    className="btn btn-outline btn-sm"
                  >
                    Move to Screening
                  </button>
                )}

                {selectedApp.status !== 'SELECTED' && (
                  <button 
                    onClick={() => handleSelectCandidate(selectedApp.id)}
                    className="btn btn-success btn-sm"
                  >
                    <Award size={14} />
                    <span>Select Candidate (Create Offer)</span>
                  </button>
                )}

                {selectedApp.status !== 'REJECTED' && selectedApp.status !== 'SELECTED' && (
                  <button 
                    onClick={() => handleRejectCandidate(selectedApp.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={14} />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Interview Modal */}
      {showInterviewModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="flex-between mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Schedule Interview Round</h3>
              <button onClick={() => setShowInterviewModal(false)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddInterview}>
              <div className="form-group">
                <label className="form-label">Round Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Technical Round 1 / HR Round"
                  value={interviewForm.roundName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Round Sequence Order</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={interviewForm.roundOrder}
                  onChange={(e) => setInterviewForm({ ...interviewForm, roundOrder: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowInterviewModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Schedule Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Result Modal */}
      {feedbackModal.show && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="flex-between mb-4">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Record Interview Evaluation</h3>
              <button onClick={() => setFeedbackModal({ show: false, stageId: null, status: 'PASSED', remarks: '' })} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRecordResult}>
              <div className="form-group">
                <label className="form-label">Round Result *</label>
                <select
                  className="form-select"
                  value={feedbackModal.status}
                  onChange={(e) => setFeedbackModal({ ...feedbackModal, status: e.target.value })}
                >
                  <option value="PASSED">PASSED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interviewer Feedback & Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Strong problem solving, cleared DSA and system design questions..."
                  value={feedbackModal.remarks}
                  onChange={(e) => setFeedbackModal({ ...feedbackModal, remarks: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setFeedbackModal({ show: false, stageId: null, status: 'PASSED', remarks: '' })} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
