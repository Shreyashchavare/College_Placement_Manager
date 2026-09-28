import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  GraduationCap, 
  Sparkles, 
  Briefcase, 
  ListChecks, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';

export function StudentDashboardView({ onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.studentId) return;
      try {
        setLoading(true);
        const [profData, statsData] = await Promise.all([
          api.getStudentById(user.studentId),
          api.getStudentDashboard(user.studentId),
        ]);
        setProfile(profData);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your student profile & dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back, {profile?.fullName}!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track campus recruitment drives, check your real-time eligibility, and monitor interview rounds.</p>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {/* Student Profile Card */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={32} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>{profile?.fullName}</h3>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Roll No: <strong>{profile?.rollNumber}</strong> &bull; Dept: <strong>{profile?.department}</strong> &bull; Batch: <strong>{profile?.graduationYear}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Academic CGPA</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{profile?.cgpa}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Backlogs</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: profile?.activeBacklogs === 0 ? '#34d399' : '#f87171' }}>
                {profile?.activeBacklogs}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.openDrives || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Open Drives for You</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <ListChecks size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.myApplicationsCount || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Submitted Applications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.inInterviewCount || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Active Interviews</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.placedCount || 0}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Job Offers Received</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Explore Available Drives</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Check company eligibility rules based on your department, CGPA, and backlogs, and apply in 1-click.
            </p>
          </div>
          <button onClick={() => onNavigate('available-drives')} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            <span>View Drives</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ListChecks size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Track Application Status</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              View interview schedules, evaluation feedback, and progress across screening and final decision stages.
            </p>
          </div>
          <button onClick={() => onNavigate('my-applications')} className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>
            <span>My Applications</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
