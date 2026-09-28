import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, GraduationCap, Building2 } from 'lucide-react';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Placement Portal
        </h2>
        <span className={`badge ${isAdmin ? 'badge-interview' : 'badge-open'}`} style={{ marginLeft: '0.5rem' }}>
          {isAdmin ? 'ADMIN CONSOLE' : 'STUDENT PORTAL'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isAdmin ? '#e0e7ff' : '#d1fae5', color: isAdmin ? '#4f46e5' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {isAdmin ? <Shield size={18} /> : <GraduationCap size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
          </div>
        </div>

        <button 
          onClick={logout} 
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#ef4444' }}
          title="Sign out"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
