import React, { useState } from 'react';
import SidebarEmpleado from './SidebarEmpleado';
import SidebarToggleButton from './SidebarToggleButton';
import './DashboardLayout.css';

const DashboardLayoutEmpleado = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarToggleButton onClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-container d-flex">
        <SidebarEmpleado isOpen={sidebarOpen} />
        <main className="main-content p-4 mt-5 mt-md-0">
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayoutEmpleado;
