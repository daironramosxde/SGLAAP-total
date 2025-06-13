// src/components/DashboardLayoutEmpleado.jsx
import React from 'react';
import SidebarEmpleado from './SidebarEmpleado';
import './DashboardLayout.css';

const DashboardLayoutEmpleado = ({ children }) => {
  return (
    <div className="dashboard-container d-flex">
      <SidebarEmpleado />
      <main className="main-content p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutEmpleado;
