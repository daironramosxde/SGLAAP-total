// src/pages/SchedulePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import FormSelectGroup from '../components/FormSelectGroup';
import FormTimeInput from '../components/FormTimeInput';
import './SchedulePage.css';

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ day: '', startTime: '', endTime: '' });
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API;
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resR, resE, resS] = await Promise.all([
        axios.get(`${API_URL}/api/v1/restaurants`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/v1/employees`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/api/v1/schedules`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRestaurants(resR.data.data);
      setEmployees(resE.data.data);
      setSchedules(resS.data.data);
      if (selectedEmployee) loadEmployeeEvents(resS.data.data, selectedEmployee);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectRest = (e) => {
    setSelectedRestaurant(e.target.value);
    setSelectedEmployee('');
    setEvents([]);
  };

  const handleSelectEmp = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    loadEmployeeEvents(schedules, empId);
  };

  const loadEmployeeEvents = (allSchedules, empId) => {
    const emp = employees.find(e => e._id === empId);
    const userSchedules = allSchedules.filter(s => s.employee === empId);
    const mapped = userSchedules.map(s => {
      const base = moment().startOf('week').add(getWeekdayOffset(s.day), 'days');
      const [sh, sm] = s.startTime.split(':');
      const [eh, em] = s.endTime.split(':');
      const start = base.clone().hour(+sh).minute(+sm);
      const end = base.clone().hour(+eh).minute(+em);
      const duration = moment.duration(end.diff(start)).humanize();
      return {
        id: s._id,
        title: `${emp.name} (${duration})`,
        start: start.toDate(),
        end: end.toDate(),
        employee: empId,
      };
    });
    setEvents(mapped);
  };

  const getWeekdayOffset = (day) => {
    const map = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    return map[day] ?? 0;
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const empSchedules = schedules.filter(s => s.employee === selectedEmployee && s.day === form.day);
    const start = moment(form.startTime, 'HH:mm');
    const end = moment(form.endTime, 'HH:mm');
    const duration = moment.duration(end.diff(start)).asHours();

    const totalDayHours = empSchedules.reduce((acc, s) => {
      const sStart = moment(s.startTime, 'HH:mm');
      const sEnd = moment(s.endTime, 'HH:mm');
      return acc + moment.duration(sEnd.diff(sStart)).asHours();
    }, 0);

    const totalWeekHours = schedules
      .filter(s => s.employee === selectedEmployee)
      .reduce((acc, s) => {
        const sStart = moment(s.startTime, 'HH:mm');
        const sEnd = moment(s.endTime, 'HH:mm');
        return acc + moment.duration(sEnd.diff(sStart)).asHours();
      }, 0);

    if (totalDayHours + duration > 8) return setNotification({ type: 'error', message: 'Máx. 8h por día' });
    if (totalWeekHours + duration > 46) return setNotification({ type: 'error', message: 'Máx. 46h por semana' });

    const payload = {
      employee: selectedEmployee,
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    try {
      await axios.post(`${API_URL}/api/v1/schedules`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ day: '', startTime: '', endTime: '' });
      fetchData();
      setNotification({ type: 'success', message: 'Horario agregado.' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const newStart = moment(start);
    const newEnd = moment(end);
    const durationHours = moment.duration(newEnd.diff(newStart)).asHours();
    if (durationHours > 8) return setNotification({ type: 'error', message: 'Máx. 8h por día' });

    const day = newStart.format('dddd');
    const empSchedules = schedules.filter(s => s.employee === event.employee && s._id !== event.id);
    const totalWeekHours = empSchedules.reduce((acc, s) => {
      const startS = moment(s.startTime, 'HH:mm');
      const endS = moment(s.endTime, 'HH:mm');
      return acc + moment.duration(endS.diff(startS)).asHours();
    }, durationHours);

    if (totalWeekHours > 46) return setNotification({ type: 'error', message: 'Máx. 46h por semana' });

    const payload = {
      startTime: newStart.format('HH:mm'),
      endTime: newEnd.format('HH:mm'),
      day: day,
    };

    try {
      await axios.put(`${API_URL}/api/v1/schedules/${event.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setNotification({ type: 'success', message: 'Horario actualizado.' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEventDelete = async (event) => {
    setNotification({
      type: 'confirm',
      message: '¿Eliminar este horario?',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/api/v1/schedules/${event.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchData();
          setNotification({ type: 'success', message: 'Horario eliminado.' });
        } catch (err) {
          console.error('Error:', err);
        }
      }
    });
  };

  const eventStyleGetter = (event) => {
    const start = moment(event.start);
    const end = moment(event.end);
    const duration = moment.duration(end.diff(start)).asHours();

    let backgroundColor = '#28a745'; // verde
    if (duration > 2 && duration <= 4) backgroundColor = '#ffc107'; // amarillo
    else if (duration > 4 && duration <= 6) backgroundColor = '#fd7e14'; // naranja
    else if (duration > 6) backgroundColor = '#dc3545'; // rojo

    return {
      style: {
        backgroundColor,
        border: 'none',
        color: 'white',
        borderRadius: '5px',
        padding: '4px 6px',
        cursor: 'pointer',
        fontWeight: 500,
      },
      className: 'calendar-event',
    };
  };

  const filteredEmployees = employees.filter(emp => emp.restaurant === selectedRestaurant);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="mb-4">Gestión de Horarios</h2>

        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <FormSelectGroup
              label="Restaurante"
              name="restaurant"
              value={selectedRestaurant}
              onChange={handleSelectRest}
              options={restaurants.map(r => ({ value: r._id, label: r.name }))}
            />
          </div>
          <div className="col-md-6">
            <FormSelectGroup
              label="Empleado"
              name="employee"
              value={selectedEmployee}
              onChange={handleSelectEmp}
              options={filteredEmployees.map(e => ({ value: e._id, label: e.name }))}
              disabled={!selectedRestaurant}
            />
          </div>
        </div>

        {selectedEmployee && (
          <form className="mb-4 p-3 bg-white shadow rounded" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <FormSelectGroup
                  label="Día"
                  name="day"
                  value={form.day}
                  onChange={handleFormChange}
                  options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => ({ value: d, label: d }))}
                />
              </div>
              <div className="col-md-3">
                <FormTimeInput
                  label="Entrada"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-md-3">
                <FormTimeInput
                  label="Salida"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-md-3 d-grid">
                <button type="submit" className="btn btn-success h-100">Agregar</button>
              </div>
            </div>
          </form>
        )}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          style={{ height: 500 }}
          onSelectEvent={handleEventDelete}
          onEventDrop={handleEventDrop}
          draggableAccessor={() => true}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
