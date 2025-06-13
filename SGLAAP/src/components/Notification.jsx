// src/components/Notification.jsx
import React from 'react';
import './Notification.css';

const Notification = ({ type, message, onClose, onConfirm }) => {
  if (!message) return null;

  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('notification-backdrop')) {
      onClose?.();
    }
  };

  return (
    <div className="notification-backdrop" onClick={handleBackgroundClick}>
      <div className={`notification-box ${type}`}>
        <p className="notification-message">{message}</p>
        {type === 'confirm' ? (
          <div className="notification-actions">
            <button className="btn btn-danger me-2" onClick={onConfirm}>Confirmar</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        ) : (
          <div className="notification-actions">
            <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
