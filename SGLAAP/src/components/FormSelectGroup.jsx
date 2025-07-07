// src/components/FormSelectGroup.jsx
import React from 'react';

const FormSelectGroup = ({ label, value, onChange, options, name, disabled = false }) => (
  <div className="input-group">
    <span className="input-group-text">{label}</span>
    <select
      className="form-select"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">Seleccionar...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelectGroup;
