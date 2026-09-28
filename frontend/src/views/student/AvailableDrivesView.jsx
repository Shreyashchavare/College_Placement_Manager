import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Check
} from 'lucide-react';

export function AvailableDrivesView({ onNavigate }) {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [eligibilityMap, setEligibilityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const fetchDrivesAndEligibility = async () => {
    if (!user?.studentId) return;
    try {
      setLoading(true);
      const openDrives = await api.getOpenDrives();
      setDrives(openDrives);

      // Check eligibility for each drive in parallel
      const map = {};
      await Promise.all(
        openDrives.map(async (d) => {
          try {
            const check = await api.checkEligibility(d.id, user.studentId);
            map[d.id] = check;
          } catch (e) {
            map[d.id] = { eligible: false, reasons: ['Could not determine eligibility'] };
          }
        })
      );
      setEligibilityMap(map);
    } catch (err) {
      setError(err.message || 'Failed to load available placement drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivesAndEligibility();
  }, [user]);

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    setError('');
    try {
      await api.applyForDrive(driveId, user.studentId);
      setToast('Application submitted successfully! Track your status in My Applications.');
      fetchDrivesAndEligibility();
    } catch (err) {
      alert(err.message || 'Application submission failed');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Available Placement Drives</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Explore active company hiring windows and verify your qualification status.</p>
        </div>
      </div>

      {toast && (
        <div className="card mb-4" style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Evaluating real-time drive eligibility...</div>
        ) : drives.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No placement drives are currently accepting applications.
          </div>
        ) : (
          drives.map((d) => {
            const eligibility = eligibilityMap[d.id] || { eligible: false, reasons: [] };
            const isEligible = eligibility.eligible;
            const alreadyApplied = eligibility.alreadyApplied;

            return (
              <div key={d.id} className="card" style={{ borderLeft: isEligible ? '5px solid #10b981' : '5px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building2 size={16} /> {d.companyName}
                      </span>
                      <span className="badge badge-open">OPEN DRIVE</span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>{d.title}</h3>
                    <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Role: {d.jobRole}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', maxWidth: '750px' }}>
                      {d.jobDescription}
                    </p>

                    {/* Metadata Pill Strip */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700 }}>
                        <DollarSign size={16} /> ₹{d.packageLpa} LPA CTC
                      </div>
                      {d.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={16} className="text-muted" /> {d.location}
                        </div>
                      )}
                      {d.deadline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                          <Calendar size={16} className="text-muted" /> Apply by: {d.deadline}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Eligibility & Apply Action Box */}
                  <div style={{ minWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    {/* Eligibility Badge Box */}
                    <div style={{ 
                      background: alreadyApplied ? '#eff6ff' : isEligible ? '#ecfdf5' : '#fef2f2', 
                      border: `1px solid ${alreadyApplied ? '#bfdbfe' : isEligible ? '#a7f3d0' : '#fecaca'}`,
                      borderRadius: '12px', 
                      padding: '0.875rem 1rem' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        {alreadyApplied ? (
                          <>
                            <Check size={18} color="#2563eb" />
                            <strong style={{ fontSize: '0.875rem', color: '#1e40af' }}>Application Submitted</strong>
                          </>
                        ) : isEligible ? (
                          <>
                            <CheckCircle2 size={18} color="#059669" />
                            <strong style={{ fontSize: '0.875rem', color: '#065f46' }}>You Meet All Criteria</strong>
                          </>
                        ) : (
                          <>
                            <XCircle size={18} color="#dc2626" />
                            <strong style={{ fontSize: '0.875rem', color: '#991b1b' }}>Criteria Not Met</strong>
                          </>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                        Required: Dept: <strong>{d.eligibilityCriteria?.allowedDepartments}</strong> | Min CGPA: <strong>{d.eligibilityCriteria?.minCgpa}</strong>
                      </div>

                      {/* Failure Reasons Breakdown */}
                      {!isEligible && !alreadyApplied && eligibility.reasons?.length > 0 && (
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #fee2e2', fontSize: '0.75rem', color: '#991b1b' }}>
                          {eligibility.reasons.map((r, i) => (
                            <div key={i}>&bull; {r}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {alreadyApplied ? (
                      <button onClick={() => onNavigate('my-applications')} className="btn btn-outline" style={{ width: '100%' }}>
                        View in My Applications
                      </button>
                    ) : isEligible ? (
                      <button 
                        onClick={() => handleApply(d.id)} 
                        disabled={applyingId === d.id}
                        className="btn btn-primary" 
                        style={{ width: '100%' }}
                      >
                        <Sparkles size={16} />
                        <span>{applyingId === d.id ? 'Submitting...' : 'Apply for this Drive'}</span>
                      </button>
                    ) : (
                      <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
                        Ineligible to Apply
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
