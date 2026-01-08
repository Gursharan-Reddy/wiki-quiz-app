import React from 'react';

function HistoryTable({ history, onView }) {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '1rem',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    color: '#64748b'
  };

  const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0'
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Title</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>
              <div style={{ fontWeight: '600' }}>{item.title}</div>
              <a href={item.url} target="_blank" style={{ fontSize: '0.8rem', color: '#2563eb' }}>
                {item.url}
              </a>
            </td>
            <td style={tdStyle}>{new Date(item.created_at).toLocaleDateString()}</td>
            <td style={tdStyle}>
              <button 
                onClick={() => onView(item)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: 'white',
                  fontSize: '0.9rem'
                }}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HistoryTable;