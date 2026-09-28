import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Award, DollarSign, Calendar, Building2, User, CheckCircle2 } from 'lucide-react';

export function PlacementsView() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const data = await api.getPlacements();
      setPlacements(data);
    } catch (err) {
      setError(err.message || 'Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const totalPlaced = placements.length;
  const packages = placements.map(p => p.packageLpa || 0);
  const highest = packages.length > 0 ? Math.max(...packages) : 0;
  const avg = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0;

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Final Placement Registry</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Official record of students selected and offered employment packages.</p>
        </div>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalPlaced}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Total Offers Extended</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{highest} LPA</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Highest Package</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{avg} LPA</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Average Package</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Dept</th>
              <th>Hiring Company</th>
              <th>Job Role</th>
              <th>Package (CTC)</th>
              <th>Offer Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading placement records...</td></tr>
            ) : placements.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No placements recorded yet.</td></tr>
            ) : (
              placements.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.studentFullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.studentRollNumber}</div>
                  </td>
                  <td>
                    <span className="badge badge-draft">{p.studentDepartment}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.companyName}</div>
                  </td>
                  <td>{p.jobRole}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                      ₹{p.packageLpa} LPA
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {p.offerDate}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-selected">
                      <CheckCircle2 size={12} style={{ marginRight: '2px' }} />
                      {p.status || 'OFFERED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
