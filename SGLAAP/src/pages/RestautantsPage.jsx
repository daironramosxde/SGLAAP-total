import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import CrudTable from '../components/CrudTable';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    lat: '',
    lng: ''
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API;

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error al obtener restaurantes:', error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      coordinates: {
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng)
      }
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/v1/restaurants/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/v1/restaurants`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setForm({ name: '', description: '', address: '', phone: '', lat: '', lng: '' });
      setEditingId(null);
      fetchRestaurants();
    } catch (error) {
      console.error('Error al guardar restaurante:', error);
    }
  };

  const handleEdit = (rest) => {
    setEditingId(rest._id);
    setForm({
      name: rest.name || '',
      description: rest.description || '',
      address: rest.address || '',
      phone: rest.phone || '',
      lat: rest.coordinates?.lat || '',
      lng: rest.coordinates?.lng || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/restaurants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRestaurants();
    } catch (error) {
      console.error('Error al eliminar restaurante:', error);
    }
  };

  const formattedRestaurants = restaurants.map((r) => ({
    _id: r._id,
    name: r.name,
    description: r.description,
    address: r.address,
    phone: r.phone,
    lat: r.coordinates?.lat || '',
    lng: r.coordinates?.lng || ''
  }));

  return (
    <DashboardLayout>
      <h2 className="mb-4">{editingId ? 'Editar Restaurante' : 'Agregar Restaurante'}</h2>

      <form onSubmit={handleSubmit} className="restaurant-form mb-4 p-3 shadow rounded bg-white">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          <div className="col">
            <input className="form-control" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col">
            <input className="form-control" name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
          </div>
          <div className="col">
            <input className="form-control" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} required />
          </div>
          <div className="col">
            <input className="form-control" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="number" step="any" className="form-control" name="lat" placeholder="Latitud" value={form.lat} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="number" step="any" className="form-control" name="lng" placeholder="Longitud" value={form.lng} onChange={handleChange} required />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100 h-100">
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <CrudTable
        data={formattedRestaurants}
        fields={['name', 'description', 'address', 'phone', 'lat', 'lng']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
};

export default RestaurantsPage;
