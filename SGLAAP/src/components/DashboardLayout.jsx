import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar />
      <main className="main-content p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
