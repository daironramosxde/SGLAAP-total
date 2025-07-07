import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Notification from '../components/Notification';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import './SchedulePage.css';

const localizer = momentLocalizer(moment);

export default function SchedulePage() {
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
  const navigate = useNavigate();

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

    const allSchedules = schedules.filter(s => s.employee === selectedEmployee);
    const totalWeekHours = allSchedules.reduce((acc, s) => {
      const sStart = moment(s.startTime, 'HH:mm');
      const sEnd = moment(s.endTime, 'HH:mm');
      return acc + moment.duration(sEnd.diff(sStart)).asHours();
    }, 0);

    if (totalDayHours + duration > 8) return setNotification({ type: 'error', message: 'No se puede trabajar más de 8h por día.' });
    if (totalWeekHours + duration > 46) return setNotification({ type: 'error', message: 'No se puede trabajar más de 46h por semana.' });

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
      setNotification({ type: 'success', message: 'Horario agregado exitosamente.' });
    } catch (err) {
      console.error('Error al agregar horario:', err);
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    const newStart = moment(start);
    const newEnd = moment(end);
    const durationHours = moment.duration(newEnd.diff(newStart)).asHours();
    if (durationHours > 8) return setNotification({ type: 'error', message: 'No se puede trabajar más de 8h por día.' });

    const day = newStart.format('dddd');

    const empSchedules = schedules.filter(s => s.employee === event.employee && s._id !== event.id);
    const totalWeekHours = empSchedules.reduce((acc, s) => {
      const startS = moment(s.startTime, 'HH:mm');
      const endS = moment(s.endTime, 'HH:mm');
      return acc + moment.duration(endS.diff(startS)).asHours();
    }, durationHours);
    if (totalWeekHours > 46) return setNotification({ type: 'error', message: 'No se puede trabajar más de 46h por semana.' });

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
      console.error('Error al mover horario:', err);
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
          console.error('Error al eliminar horario:', err);
        }
      }
    });
  };

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#007bff',
      borderRadius: '5px',
      border: 'none',
      color: 'white',
      padding: '4px',
      cursor: 'pointer',
      transition: '0.2s',
    },
    className: 'calendar-event'
  });

  const filteredEmployees = employees.filter(emp => emp.restaurant === selectedRestaurant);

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="mb-4">Gestión de Horarios</h2>

        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <select className="form-select" value={selectedRestaurant} onChange={handleSelectRest}>
              <option value="">Selecciona Restaurante</option>
              {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
          <div className="col-md-6 mb-2">
            <select className="form-select" value={selectedEmployee} onChange={handleSelectEmp}>
              <option value="">Selecciona Empleado</option>
              {filteredEmployees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
        </div>

        {selectedEmployee && (
          <form className="mb-4 p-3 bg-white shadow rounded" onSubmit={handleSubmit}>
            <div className="row row-cols-1 row-cols-md-4 g-3">
              <div className="col">
                <select className="form-select" name="day" value={form.day} onChange={handleFormChange} required>
                  <option value="">Día</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="col">
                <input type="time" className="form-control" name="startTime" value={form.startTime} onChange={handleFormChange} required />
              </div>
              <div className="col">
                <input type="time" className="form-control" name="endTime" value={form.endTime} onChange={handleFormChange} required />
              </div>
              <div className="col">
                <button className="btn btn-success w-100 h-100" type="submit">Agregar horario</button>
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
}
