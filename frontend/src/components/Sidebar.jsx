import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Award, 
  Sparkles,
  CheckCircle2,
  ListChecks
} from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab }) {
  const { isAdmin } = useAuth();

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'drives', label: 'Placement Drives', icon: Briefcase },
    { id: 'applications', label: 'Applications Pipeline', icon: FileText },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'placements', label: 'Final Placements', icon: Award },
  ];

  const studentNav = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'available-drives', label: 'Available Drives', icon: Sparkles },
    { id: 'my-applications', label: 'My Applications', icon: ListChecks },
    { id: 'my-placements', label: 'Placement Offers', icon: Award },
  ];

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Award size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>Thinqloud</h1>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.04em' }}>PLACEMENT MANAGER</span>
          </div>
        </div>
      </div>

      <nav style={{ padding: '1rem 0', flex: 1 }}>
        <div style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
          {isAdmin ? 'ADMINISTRATION' : 'STUDENT WORKSPACE'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${active ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
        Campus Hiring Assessment<br />
        <span style={{ color: '#94a3b8' }}>Thinqloud Solutions</span>
      </div>
    </aside>
  );
}
