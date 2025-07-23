import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function EditCase() {
  const location = useLocation();
  const { caseId } = location.state || {};

  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    if (caseId) {
      fetch(`http://localhost:4000/cases/${caseId}`)
        .then(res => res.json())
        .then(data => setCaseData(data))
        .catch(err => console.error('Failed to load case:', err));
    }
  }, [caseId]);

  if (!caseId) return <p>No case selected.</p>;
  if (!caseData) return <p>Loading case...</p>;

  return (
    <div className="Page">
      <h1>Edit Case</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Case Number:</label><br />
        <input
          type="text"
          value={caseData.caseNumber}
          readOnly
          style={{ width: '200px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Date of Event:</label><br />
        <input
          type="date"
          value={caseData.eventDate.split('T')[0]}
          readOnly
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Time of Event:</label><br />
        <input
          type="time"
          value={caseData.eventTime}
          readOnly
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Crime Type:</label><br />
        <input
          type="text"
          value={caseData.crimeType}
          readOnly
          style={{ padding: '5px' }}
        />
      </div>
    </div>
  );
}

export default EditCase;
