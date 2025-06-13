// src/components/SidebarEmpleado.jsx
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const SidebarEmpleado = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="logo text-center my-4">
        <img src="/logo.png" alt="Logo" className="logo-img" />
      </div>
      <nav className="nav flex-column px-3">
        <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard/empleado">Dashboard</Link>
        <Link className={`nav-link ${isActive('/settings') ? 'active' : ''}`} to="/settings">Configuración</Link>
      </nav>
      <div className="logout-btn-container text-center mt-4 px-3">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpleado;
