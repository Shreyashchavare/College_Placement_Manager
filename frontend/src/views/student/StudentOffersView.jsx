import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Award, CheckCircle2, Calendar, Building2, DollarSign, Sparkles } from 'lucide-react';

export function StudentOffersView() {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user?.studentId) return;
      try {
        setLoading(true);
        const data = await api.getPlacementsByStudent(user.studentId);
        setPlacements(data);
      } catch (err) {
        setError(err.message || 'Failed to load placement offers');
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [user]);

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Placement Offers</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Official job offers and employment package confirmations.</p>
        </div>
      </div>

      {error && (
        <div className="card mb-4" style={{ background: '#fee2e2', color: '#991b1b' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading offer letters...</div>
      ) : placements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No formal placement offers yet. Keep completing your interview rounds!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {placements.map((p) => (
            <div key={p.id} className="card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '2px solid #86efac', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)' }}>
              
              <div className="flex-between mb-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={28} />
                </div>
                <span className="badge badge-selected">
                  <CheckCircle2 size={13} style={{ marginRight: '3px' }} />
                  {p.status || 'OFFERED'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                {p.companyName}
              </h3>
              <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600, marginBottom: '1.25rem' }}>
                Position: {p.jobRole}
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Annual Compensation (CTC)
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#047857', marginTop: '0.25rem' }}>
                  ₹{p.packageLpa} LPA
                </div>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #dcfce7', paddingTop: '0.75rem' }}>
                <Calendar size={15} />
                <span>Offer Extended: <strong>{p.offerDate}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
