// src/components/ScheduleCalendar.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/CalendarOverride.css';

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function ScheduleCalendar() {
  const [restaurants, setRestaurants] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [selectedRest, setSelectedRest] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRest, resEmp, resHor] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/restaurants', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/v1/employees', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/v1/schedules', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setRestaurants(resRest.data.data || []);
      setEmpleados(resEmp.data.data || []);
      setHorarios(resHor.data.data || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const handleChangeRest = (e) => {
    setSelectedRest(e.target.value);
    setSelectedEmpleado('');
    setEventos([]);
  };

  const handleChangeEmpleado = (e) => {
    const empleadoId = e.target.value;
    setSelectedEmpleado(empleadoId);
    generarEventos(empleadoId);
  };

  const generarEventos = (empleadoId) => {
    const empleado = empleados.find((e) => e._id === empleadoId);
    if (!empleado) return;

    const horariosEmpleado = horarios.filter((h) => h.employee === empleadoId);
    const eventosEmpleado = horariosEmpleado.map((h) => {
      const [entradaHora, entradaMin] = h.startTime.split(':');
      const [salidaHora, salidaMin] = h.endTime.split(':');

      const diaSemana = getDiaSemana(h.day);
      const hoy = new Date();
      const baseDate = new Date(hoy);
      baseDate.setDate(hoy.getDate() + ((7 + diaSemana - hoy.getDay()) % 7));

      const start = new Date(baseDate);
      start.setHours(entradaHora, entradaMin);

      const end = new Date(baseDate);
      end.setHours(salidaHora, salidaMin);

      return {
        title: `${empleado.name} (${empleado.position})`,
        start,
        end,
      };
    });

    setEventos(eventosEmpleado);
  };

  const empleadosFiltrados = empleados.filter((e) => e.restaurant === selectedRest);

  return (
    <div className="mb-4">
      <h5 className="mb-3">🕓 Visualizador de Horarios por Empleado</h5>

      <div className="row mb-3">
        <div className="col-md-6">
          <select className="form-select" value={selectedRest} onChange={handleChangeRest}>
            <option value="">Seleccionar restaurante</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>{r.name} - {r.location}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select className="form-select" value={selectedEmpleado} onChange={handleChangeEmpleado} disabled={!selectedRest}>
            <option value="">Seleccionar empleado</option>
            {empleadosFiltrados.map((e) => (
              <option key={e._id} value={e._id}>{e.name} - {e.position}</option>
            ))}
          </select>
        </div>
      </div>

      {eventos.length > 0 ? (
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          step={30}
          timeslots={2}
          style={{ height: 500 }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: '#0d3b66',
              color: 'white',
              borderRadius: '5px',
              padding: '2px 6px',
            },
          })}
        />
      ) : (
        <p className="text-muted">Selecciona un empleado para ver sus horarios.</p>
      )}
    </div>
  );
}

function getDiaSemana(dayName) {
  const dias = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return dias[dayName];
}
