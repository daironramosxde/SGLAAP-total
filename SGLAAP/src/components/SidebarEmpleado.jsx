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
    <aside className="sidebar shadow-sm">
      <div className="logo text-center my-4">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h5 className="mt-2 mb-0 text-light">AAP Empleado</h5>
      </div>

      <nav className="nav flex-column px-3">
        <Link className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} to="/dashboard/empleado">
          <i className="fas fa-chart-line me-2"></i> Dashboard
        </Link>
        <Link className={`nav-link ${isActive('/settings') ? 'active' : ''}`} to="/settings">
          <i className="fas fa-cog me-2"></i> Configuración
        </Link>
      </nav>

      <div className="logout-btn-container text-center mt-auto px-3 mb-4">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default SidebarEmpleado;
