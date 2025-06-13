import React from 'react';

const CrudTable = ({ data = [], fields = [], onEdit, onDelete }) => {
  if (!data.length) {
    return <p className="text-center">No hay registros disponibles.</p>;
  }

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          {fields.map((field) => (
            <th key={field}>{field}</th>
          ))}
          {(onEdit || onDelete) && <th>Acciones</th>}
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
              <td>
                {onEdit && (
                  <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(item)}>Editar</button>
                )}
                {onDelete && (
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(item._id)}>Eliminar</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CrudTable;
