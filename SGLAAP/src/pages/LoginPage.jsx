// src/pages/LoginPage.jsx
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
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
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
    <div className="login-container d-flex">
      <div className="login-left text-white d-flex flex-column justify-content-center align-items-center">
        <h2>Al Agua Patos</h2>
        <p>¡Gestiona tus reservas y eventos fácil y rápido!</p>
        <img src="/logo.png" alt="Logo AAP" className="logo" />
      </div>
      <div className="login-right d-flex flex-column justify-content-center px-5">
        <h3 className="mb-4 text-center">Iniciar Sesión</h3>
        <form onSubmit={handleSubmit}>
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
