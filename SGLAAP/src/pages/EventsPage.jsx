import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import CrudTable from '../components/CrudTable';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    date: '',
    description: '',
    restaurant: ''
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setEvents(data || []);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/restaurants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error al obtener restaurantes:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      date: new Date(form.date).toISOString()
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/v1/events/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/v1/events', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: '', date: '', description: '', restaurant: '' });
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error al guardar evento:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setForm({
      name: event.name,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      description: event.description,
      restaurant: event.restaurant
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const getRestaurantName = (id) => {
    const r = restaurants.find((rest) => rest._id === id);
    return r ? `${r.name} - ${r.location}` : 'Desconocido';
  };

  const formattedEvents = events.map((e) => ({
    _id: e._id,
    name: e.name,
    date: new Date(e.date).toLocaleString(),
    description: e.description,
    restaurant: getRestaurantName(e.restaurant)
  }));

  return (
    <DashboardLayout>
      <h2 className="mb-4">{editingId ? 'Editar Evento' : 'Agregar Evento'}</h2>

      <form onSubmit={handleSubmit} className="event-form mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              className="form-control"
              name="name"
              placeholder="Nombre del evento"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              name="description"
              placeholder="Descripción"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="restaurant"
              value={form.restaurant}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona restaurante</option>
              {restaurants.length > 0 ? (
                restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} - {r.location}
                  </option>
                ))
              ) : (
                <option disabled>No hay restaurantes disponibles</option>
              )}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <CrudTable
        data={formattedEvents}
        fields={['name', 'date', 'description', 'restaurant']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
};

export default EventsPage;
