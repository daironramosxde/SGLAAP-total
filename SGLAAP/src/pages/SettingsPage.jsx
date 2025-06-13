import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import SidebarEmpleado from '../components/SidebarEmpleado';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import '../pages/SettingsPage.css';

const SettingsPage = () => {
  const { auth } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [editable, setEditable] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth || !auth.id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/users/${auth.id}`, {
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

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/v1/users/${auth.id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditable(false);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const isEmpleado = auth?.role === 'empleado';

  return (
    <div className="dashboard-container d-flex">
      {isEmpleado ? <SidebarEmpleado /> : <Sidebar />}
      <main className="main-content p-4">
        <h2 className="mb-4">Configuración de Cuenta</h2>

        <div className="settings-section">
          <div className="settings-card">
            <h4>Información del Usuario</h4>
            <form className="settings-form">
              <div className="mb-3">
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={userData.name}
                  onChange={handleChange}
                  disabled={isEmpleado || !editable}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={isEmpleado || !editable}
                />
              </div>
              {!isEmpleado && (!editable ? (
                <button type="button" className="btn btn-secondary" onClick={() => setEditable(true)}>
                  Editar
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                  Guardar Cambios
                </button>
              ))}
            </form>
          </div>

          <div className="settings-card theme-toggle">
            <h4>Preferencias de Apariencia</h4>
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
      </main>
    </div>
  );
};

export default SettingsPage;
