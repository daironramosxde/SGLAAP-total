import React, { useContext, useEffect, useState } from 'react';
import SidebarEmpleado from '../components/SidebarEmpleado';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import '../pages/SettingsPage.css';

const SettingsEmpleado = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth || !auth.id) return;
      try {
        const res = await axios.get(`${API_URL}/api/v1/users/${auth.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email } = res.data.data;
        setUserData({ name, email });
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
      }
    };
    fetchUserData();
  }, [auth, token]);

  return (
    <div className="dashboard-container d-flex flex-column flex-md-row">
      <SidebarEmpleado />
      <main className="main-content p-4 w-100">
        <h2 className="mb-4">Configuración de Cuenta</h2>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="settings-card bg-white shadow rounded p-3">
              <h4 className="mb-3">Información del Usuario</h4>
              <form className="settings-form">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={userData.name}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={userData.email}
                    disabled
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="settings-card bg-white shadow rounded p-3">
              <h4 className="mb-3">Preferencias de Apariencia</h4>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="themeSwitch"
                  checked={darkMode}
                  onChange={toggleTheme}
                />
                <label className="form-check-label" htmlFor="themeSwitch">
                  Activar modo oscuro
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsEmpleado;
