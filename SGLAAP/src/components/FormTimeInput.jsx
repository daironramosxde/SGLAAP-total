    // src/components/FormTimeInput.jsx
import React from 'react';

const FormTimeInput = ({ label, name, value, onChange }) => (
  <div className="input-group">
    <span className="input-group-text">{label}</span>
    <input
      type="time"
      name={name}
      className="form-control"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default FormTimeInput;
