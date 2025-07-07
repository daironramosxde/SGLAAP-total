import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/api/v1/auth/login`, {
        email,
        password,
      });
      if (res.data.success) {
        login(res.data.token);
        const user = res.data.token ? JSON.parse(atob(res.data.token.split('.')[1])) : null;
        const role = user?.role;
        if (role === 'gerente') navigate('/dashboard/gerente');
        else if (role === 'empleado') navigate('/dashboard/empleado');
        else if (role === 'cliente') navigate('/dashboard/cliente');
      }
    } catch (err) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container d-flex flex-column flex-md-row min-vh-100">
      <div className="login-left d-flex flex-column justify-content-center align-items-center text-white p-5 w-100 w-md-50">
        <h2 className="fw-bold">Al Agua Patos</h2>
        <p className="text-center px-4">¡Gestiona tus reservas y eventos fácil y rápido!</p>
        <img src="/logo.png" alt="Logo AAP" className="logo mt-3" />
      </div>
      <div className="login-right d-flex flex-column justify-content-center p-5 bg-light w-100 w-md-50">
        <h3 className="mb-4 text-center">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-aap">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
