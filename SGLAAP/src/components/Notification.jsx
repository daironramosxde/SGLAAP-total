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
      <div className={`notification-box animate-in ${type}`}>
        <p className="notification-message">{message}</p>
        <div className="notification-actions">
          {type === 'confirm' ? (
            <>
              <button className="btn btn-danger me-2" onClick={onConfirm}>Confirmar</button>
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
