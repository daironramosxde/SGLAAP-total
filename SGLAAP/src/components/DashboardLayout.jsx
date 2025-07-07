import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SidebarToggleButton from '../components/SidebarToggleButton';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <SidebarToggleButton onClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-container d-flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content p-4 mt-5 mt-md-0">
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
