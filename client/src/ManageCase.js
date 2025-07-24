// ManageCase.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ManageCase = () => {
  const navigate = useNavigate();
  const { caseId } = useLocation().state || {};

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (caseId) {
      fetch(`http://localhost:4000/cases/${caseId}/devices`)
        .then(res => res.json())
        .then(data => setDevices(data))
        .catch(err => console.error('Failed to fetch devices:', err));
    }
  }, [caseId]);

  if (!caseId) return <p>No case selected.</p>;

  return (
    <div className="Page">
      <h1>Manage Case</h1>
      <p>Case ID: {caseId}</p>

      <button
        className="gray-button"
        onClick={() => navigate('/editcase', { state: { caseId } })}
      >
        ✏️ Edit Details
      </button>

      <br /><br />

      <button
        className="gray-button"
        onClick={() => navigate('/collectevidence', { state: { caseId } })}
      >
        📦 Collect Evidence
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h2>Collected Devices</h2>
      {devices.length === 0 ? (
        <p>No devices collected for this case.</p>
      ) : (
        <ul>
          {devices.map((d) => (
            <li key={d.id}>
              {d.name} ({d.type}) – Collected on {new Date(d.collectedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageCase;
