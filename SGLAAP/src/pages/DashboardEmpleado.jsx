// src/pages/DashboardEmpleado.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DashboardLayoutEmpleado from '../components/DashboardLayoutEmpleado';
import CalendarComponent from '../components/CalendarComponent';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { AuthContext } from '../context/AuthContext';
import '../pages/DashboardGerente.css';

export default function DashboardEmpleado() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const { auth } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (auth?.email) {
      fetchEmpleadoYDatos();
    }
  }, [auth]);

  useEffect(() => {
    if (fechaFiltro) {
      const filtrados = eventos.filter(e => {
        const eventDate = new Date(e.date).toISOString().split('T')[0];
        return eventDate === fechaFiltro;
      });
      setFilteredEventos(filtrados);
    } else {
      setFilteredEventos(eventos);
    }
  }, [fechaFiltro, eventos]);

  const fetchEmpleadoYDatos = async () => {
    try {
      // Obtener el empleado asociado al correo del usuario logueado
      const resEmpleado = await axios.get('http://localhost:5000/api/v1/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const empleado = resEmpleado.data.data.find(emp => emp.email === auth.email);

      if (!empleado) return;

      // Obtener eventos del restaurante del empleado
      const resEventos = await axios.get('http://localhost:5000/api/v1/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const eventosData = (Array.isArray(resEventos.data) ? resEventos.data : resEventos.data.data)
        .filter(e => e.restaurant === empleado.restaurant);
      setEventos(eventosData);

      // Obtener horarios del empleado
      const resHorarios = await axios.get('http://localhost:5000/api/v1/schedules', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const horariosData = (Array.isArray(resHorarios.data) ? resHorarios.data : resHorarios.data.data)
        .filter(h => h.employee === empleado._id);
      setHorarios(horariosData);
    } catch (err) {
      console.error('Error al obtener datos:', err);
    }
  };

  return (
    <DashboardLayoutEmpleado>
      <div className="dashboard-gerente dark-theme">
        <h2 className="dashboard-title">Bienvenido, Empleado 👋</h2>

        <div className="filter-panel mb-4">
          <label className="form-label text-white me-2">Filtrar eventos por fecha:</label>
          <input type="date" value={fechaFiltro} onChange={e => setFechaFiltro(e.target.value)} className="form-control w-auto d-inline-block" />
        </div>

        <div className="calendar-section">
          <div className="calendar-card card">
            <h4 className="calendar-title">📅 Eventos de tu Restaurante</h4>
            <CalendarComponent events={filteredEventos.map(e => ({
              title: `${e.name}: ${e.description}`,
              start: new Date(e.date),
              end: new Date(new Date(e.date).getTime() + 2 * 60 * 60 * 1000),
            }))} />
          </div>

          <div className="calendar-card card">
            <h4 className="calendar-title">🕒 Tus Horarios</h4>
            <ScheduleCalendar schedules={horarios} onlyOwn={true} />
          </div>
        </div>
      </div>
    </DashboardLayoutEmpleado>
  );
}
