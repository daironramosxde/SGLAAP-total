import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import CrudTable from '../components/CrudTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    restaurant: '',
    password: '',
    role: ''
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API;

  const showToast = (message, type = 'info') => {
    toast[type](message, {
      position: 'top-right',
      autoClose: 3000
    });
  };

  const positionOptions = [
    'Mesero',
    'Cocinero',
    'Administrador',
    'Auxiliar de cocina',
    'Cajero',
    'Domiciliario'
  ];

  const roleOptions = [
    { label: 'Empleado', value: 'empleado' },
    { label: 'Gerente', value: 'gerente' }
  ];

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.data || []);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

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
    fetchEmployees();
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/v1/employees/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await axios.put(`${API_URL}/api/v1/users/email/${form.email}`, {
          name: form.name,
          role: form.role
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        showToast('Empleado y usuario actualizados correctamente', 'success');
      } else {
        try {
          await axios.post(`${API_URL}/api/v1/auth/register`, {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (userError) {
          if (userError.response?.data?.error?.includes('duplicate')) {
            showToast('Ya existe un usuario con ese correo.', 'warning');
            return;
          } else {
            console.error('❌ Error al crear usuario:', userError.response?.data);
            throw userError;
          }
        }

        await axios.post(`${API_URL}/api/v1/employees`, {
          name: form.name,
          email: form.email,
          position: form.position,
          restaurant: form.restaurant
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        showToast('✅ Usuario y empleado creados con éxito.', 'success');
      }

      setForm({
        name: '',
        email: '',
        position: '',
        restaurant: '',
        password: '',
        role: ''
      });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error('❌ Error al guardar empleado y usuario:', error);
      console.error('❌ Detalle del error:', error.response?.data);
      showToast(`❌ Error al guardar. ${error.response?.data?.error || 'Verifica los campos.'}`, 'error');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      restaurant: emp.restaurant,
      password: '',
      role: ''
    });
  };

  const handleDelete = async (id) => {
    try {
      const empleado = employees.find(e => e._id === id);
      await axios.delete(`${API_URL}/api/v1/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await axios.delete(`${API_URL}/api/v1/users/email/${empleado.email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
      showToast('Empleado y usuario eliminados correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar empleado y usuario:', error);
      showToast('Error al eliminar empleado o usuario', 'error');
    }
  };

  const getRestaurantName = (id) => {
    const rest = restaurants.find((r) => r._id === id);
    return rest ? `${rest.name} - ${rest.location}` : 'Desconocido';
  };

  const formattedEmployees = employees.map((e) => ({
    _id: e._id,
    name: e.name,
    email: e.email,
    position: e.position,
    restaurant: getRestaurantName(e.restaurant)
  }));

  return (
    <DashboardLayout>
      <h2 className="mb-4">{editingId ? 'Editar Empleado' : 'Agregar Empleado'}</h2>

      <form onSubmit={handleSubmit} className="employee-form mb-4 p-3 shadow rounded bg-white">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          <div className="col">
            <input className="form-control" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="email" className="form-control" name="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col">
            <select className="form-select" name="position" value={form.position} onChange={handleChange} required>
              <option value="">Selecciona un cargo</option>
              {positionOptions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" name="restaurant" value={form.restaurant} onChange={handleChange} required>
              <option value="">Selecciona un restaurante</option>
              {restaurants.length > 0 ? (
                restaurants.map((r) => (
                  <option key={r._id} value={r._id}>{r.name} - {r.location}</option>
                ))
              ) : (
                <option disabled>No hay restaurantes disponibles</option>
              )}
            </select>
          </div>
          <div className="col">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
            />
          </div>
          <div className="col">
            <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
              <option value="">Selecciona un rol</option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100 h-100">
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      </form>

      <CrudTable
        data={formattedEmployees}
        fields={['name', 'email', 'position', 'restaurant']}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ToastContainer />
    </DashboardLayout>
  );
};

export default EmployeesPage;
