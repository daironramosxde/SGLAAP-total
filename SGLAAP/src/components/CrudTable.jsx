// src/components/CrudTable.jsx
import React from 'react';
import './CrudTable.css'; // Estilos personalizados

const CrudTable = ({ data = [], fields = [], onEdit, onDelete }) => {
  if (!data.length) {
    return <p className="text-center fw-semibold text-muted">No hay registros disponibles.</p>;
  }

  return (
    <div className="table-responsive crud-table-wrapper">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            {fields.map((field) => (
              <th key={field} className="text-capitalize">{field}</th>
            ))}
            {(onEdit || onDelete) && <th className="text-center">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {fields.map((field) => (
                <td key={field}>
                  {typeof item[field] === 'object'
                    ? JSON.stringify(item[field])
                    : item[field]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="text-center">
                  {onEdit && (
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(item)}>
                      <i className="fas fa-edit"></i> Editar
                    </button>
                  )}
                  {onDelete && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(item._id)}>
                      <i className="fas fa-trash-alt"></i> Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudTable;
