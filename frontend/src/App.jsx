import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './views/LoginView';

// Admin Views
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { StudentsView } from './views/admin/StudentsView';
import { CompaniesView } from './views/admin/CompaniesView';
import { DrivesView } from './views/admin/DrivesView';
import { ApplicationsView } from './views/admin/ApplicationsView';
import { PlacementsView } from './views/admin/PlacementsView';

// Student Views
import { StudentDashboardView } from './views/student/StudentDashboardView';
import { AvailableDrivesView } from './views/student/AvailableDrivesView';
import { MyApplicationsView } from './views/student/MyApplicationsView';
import { StudentOffersView } from './views/student/StudentOffersView';

export function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
        Initializing College Placement Manager...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderContent = () => {
    if (isAdmin) {
      switch (currentTab) {
        case 'dashboard':
          return <AdminDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
        case 'drives':
          return <DrivesView />;
        case 'applications':
          return <ApplicationsView />;
        case 'students':
          return <StudentsView />;
        case 'companies':
          return <CompaniesView />;
        case 'placements':
          return <PlacementsView />;
        default:
          return <AdminDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
      }
    } else {
      switch (currentTab) {
        case 'dashboard':
          return <StudentDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
        case 'available-drives':
          return <AvailableDrivesView onNavigate={(tab) => setCurrentTab(tab)} />;
        case 'my-applications':
          return <MyApplicationsView />;
        case 'my-placements':
          return <StudentOffersView />;
        default:
          return <StudentDashboardView onNavigate={(tab) => setCurrentTab(tab)} />;
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
