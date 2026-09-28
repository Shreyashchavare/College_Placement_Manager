import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  ListChecks, 
  CheckCircle2, 
  Clock, 
  Award, 
  XCircle, 
  Calendar, 
  Building2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export function MyApplicationsView() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyApplications = async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const data = await api.getMyApplications(user.studentId);
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [user]);

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Applications</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track your active applications, interview rounds, and evaluation feedback.</p>
        </div>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your application pipeline...</div>
        ) : applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            You have not submitted any applications yet. Explore available placement drives to apply!
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="card" style={{ position: 'relative' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={16} /> {app.companyName}
                    </span>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{app.driveTitle}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Role: <strong>{app.jobRole}</strong> &bull; CTC Package: <strong style={{ color: '#059669' }}>₹{app.packageLpa} LPA</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>

              {/* Selection Celebration Banner */}
              {app.status === 'SELECTED' && (
                <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
                  <Award size={32} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Congratulations! You have been Selected!</h4>
                    <p style={{ fontSize: '0.85rem', color: '#d1fae5' }}>
                      The hiring committee has extended a placement offer of <strong>₹{app.packageLpa} LPA</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Interview Rounds Lifecycle */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                  Interview Progression & Results
                </h4>

                {(!app.interviewStages || app.interviewStages.length === 0) ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {app.status === 'APPLIED' ? 'Application received and pending initial screening by placement coordinator.' : 'No interview rounds scheduled yet.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {app.interviewStages.map((stage) => (
                      <div key={stage.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.875rem' }}>
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
                            Date: {stage.scheduledAt.replace('T', ' ')}
                          </div>
                        )}

                        {stage.feedback && (
                          <div style={{ fontSize: '0.8rem', color: '#334155', background: '#f1f5f9', padding: '0.4rem 0.6rem', borderRadius: '6px', marginTop: '0.4rem' }}>
                            <strong>Feedback:</strong> "{stage.feedback}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {app.remarks && (
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Coordinator Remarks: <em>{app.remarks}</em>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
