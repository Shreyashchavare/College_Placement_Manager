import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31104b 100%)', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '460px', background: 'rgba(255, 255, 255, 0.96)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(20px)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', margin: '0 auto 1rem', borderRadius: '16px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
            Placement Manager
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.375rem' }}>
            Thinqloud Solutions Hiring Assessment Platform
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Mail size={15} className="text-muted" /> Email Address
            </label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="e.g. admin@placement.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Lock size={15} className="text-muted" /> Password
            </label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={16} color="#4f46e5" />
            <span>1-Click Demo Evaluation Profiles</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
            <button
              type="button"
              onClick={() => quickLogin('admin@placement.com', 'Admin@123')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <Shield size={15} color="#4f46e5" />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Admin Officer</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Full Privileges</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('john.cse@placement.com', 'Student@123')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <GraduationCap size={15} color="#059669" />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>John (CSE)</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Placed Student</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('sarah.it@placement.com', 'Student@123')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <GraduationCap size={15} color="#0284c7" />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Sarah (IT)</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>In Interview</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('rachel.mech@placement.com', 'Student@123')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <GraduationCap size={15} color="#d97706" />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>Rachel (MECH)</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Eligible Test</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('david.cse@placement.com', 'Student@123')}
              className="btn btn-outline btn-sm"
              style={{ justifyContent: 'flex-start', background: '#f8fafc', borderColor: '#cbd5e1' }}
            >
              <GraduationCap size={15} color="#dc2626" />
              <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>David (CSE)</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Rejected Flow</div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
