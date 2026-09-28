import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export function AdminDashboardView({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dashboard metrics...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Placement Cell Overview</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Live analytics, drive activity, and recruitment pipeline.</p>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {/* Stats Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalStudents || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Enrolled Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalCompanies || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Partner Companies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.openDrives || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Open Drives ({stats?.totalDrives} Total)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalPlaced || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Students Placed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{stats?.averagePackageLpa || 0} LPA</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Average Package (CTC)</div>
          </div>
        </div>
      </div>

      {/* Application Status Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.15rem' }}>Application Pipeline Breakdown</h3>
            <button onClick={() => onNavigate('applications')} className="btn btn-outline btn-sm">
              <span>View All Applications</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            {stats?.applicationsByStatus && Object.entries(stats.applicationsByStatus).map(([status, count]) => {
              const colors = {
                APPLIED: { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
                SCREENING: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
                INTERVIEW: { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
                SELECTED: { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
                REJECTED: { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
              };
              const c = colors[status] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };

              return (
                <div key={status} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: c.color }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: c.color, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => onNavigate('drives')} className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <Briefcase size={18} />
              <span>Create Placement Drive</span>
            </button>
            <button onClick={() => onNavigate('students')} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Users size={18} />
              <span>Onboard New Student</span>
            </button>
            <button onClick={() => onNavigate('companies')} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Building2 size={18} />
              <span>Register Partner Company</span>
            </button>
            <button onClick={() => onNavigate('placements')} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Award size={18} />
              <span>View Placed Candidates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
