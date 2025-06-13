import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Páginas
import LoginPage from '../pages/LoginPage';
import DashboardGerente from '../pages/DashboardGerente';
import DashboardEmpleado from '../pages/DashboardEmpleado';
import EmployeesPage from '../pages/EmployeesPage';
import SchedulePage from '../pages/SchedulePage';
import EventsPage from '../pages/EventsPage';
import RestaurantsPage from '../pages/RestautantsPage';
import SettingsPage from '../pages/SettingsPage';

const PrivateRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);
  if (!auth) return <Navigate to="/login" />;
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(auth.role)) {
      return <Navigate to="/login" />;
    }
  }
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Gerente */}
        <Route path="/dashboard/gerente" element={
          <PrivateRoute role="gerente"><DashboardGerente /></PrivateRoute>
        } />
        <Route path="/employees" element={
          <PrivateRoute role="gerente"><EmployeesPage /></PrivateRoute>
        } />
        <Route path="/schedule" element={
          <PrivateRoute role="gerente"><SchedulePage /></PrivateRoute>
        } />
        <Route path="/events" element={
          <PrivateRoute role="gerente"><EventsPage /></PrivateRoute>
        } />
        <Route path="/restaurants" element={
          <PrivateRoute role="gerente"><RestaurantsPage /></PrivateRoute>
        } />

        {/* Compartido */}
        <Route path="/settings" element={
          <PrivateRoute role={["gerente", "empleado"]}><SettingsPage /></PrivateRoute>
        } />

        {/* Empleado */}
        <Route path="/dashboard/empleado" element={
          <PrivateRoute role="empleado"><DashboardEmpleado /></PrivateRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
