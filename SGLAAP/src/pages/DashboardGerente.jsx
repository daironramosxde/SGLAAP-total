import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import CalendarComponent from '../components/CalendarComponent';
import ScheduleCalendar from '../components/ScheduleCalendar';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../pages/DashboardGerente.css';

export default function DashboardGerente() {
  const [eventos, setEventos] = useState([]);
  const [empleadosCount, setEmpleadosCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API;
      const [resEvents, resEmployees] = await Promise.all([
        axios.get(`${API_URL}/api/v1/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/v1/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const eventData = Array.isArray(resEvents.data) ? resEvents.data : resEvents.data.data;
      setEventos(eventData);
      setEmpleadosCount(resEmployees.data.data.length);

    } catch (err) {
      console.error('Error al obtener datos:', err);
    }
  };

  const eventosPorMes = Array.from({ length: 12 }, (_, i) => {
    const count = eventos.filter(e => new Date(e.date).getMonth() === i).length;
    const mes = new Date(2023, i, 1).toLocaleString('default', { month: 'short' });
    return { mes, eventos: count };
  });

  return (
    <DashboardLayout>
      <div className="dashboard-gerente dark-theme">
        <h2 className="dashboard-title">Bienvenido, Gerente 👋</h2>

        <div className="kpi-section">
          <div className="kpi-card">
            <p className="kpi-label">Empleados Activos</p>
            <h3 className="kpi-value">{empleadosCount}</h3>
          </div>
          <div className="kpi-card">
            <p className="kpi-label">Eventos Programados</p>
            <h3 className="kpi-value">{eventos.length}</h3>
          </div>
        </div>

        <div className="chart-panel card">
          <h4 className="chart-title">Eventos por Mes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={eventosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="eventos" stroke="#00d4ff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="calendar-section">
          <div className="calendar-card card">
            <h4 className="calendar-title">📅 Calendario de Eventos</h4>
            <CalendarComponent events={eventos.map(e => ({
              title: e.name,
              start: new Date(e.date),
              end: new Date(new Date(e.date).getTime() + 2 * 60 * 60 * 1000),
            }))} />
          </div>

          <div className="calendar-card card">
            <h4 className="calendar-title">📆 Horarios del Personal</h4>
            <ScheduleCalendar />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
