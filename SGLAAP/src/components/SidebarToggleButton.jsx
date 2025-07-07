import React from 'react';
import './SidebarToggleButton.css';

const SidebarToggleButton = ({ onClick }) => {
  return (
    <button className="sidebar-toggle d-md-none" onClick={onClick}>
      ☰
    </button>
  );
};

export default SidebarToggleButton;
