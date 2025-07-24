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
    onChange={(e) =>
      setCaseData({ ...caseData, caseNumber: e.target.value })
    }
    style={{ width: '200px', padding: '5px' }}
  />
</div>

<div style={{ marginBottom: '20px' }}>
  <label>Date of Event:</label><br />
  <input
    type="date"
    value={caseData.eventDate.split('T')[0]}
    onChange={(e) =>
      setCaseData({ ...caseData, eventDate: e.target.value })
    }
    style={{ padding: '5px' }}
  />
</div>

<div style={{ marginBottom: '20px' }}>
  <label>Time of Event:</label><br />
  <input
    type="time"
    value={caseData.eventTime}
    onChange={(e) =>
      setCaseData({ ...caseData, eventTime: e.target.value })
    }
    style={{ padding: '5px' }}
  />
</div>

<div style={{ marginBottom: '20px' }}>
  <label>Crime Type:</label><br />
  <select
    value={caseData.crimeType}
    onChange={(e) =>
      setCaseData({ ...caseData, crimeType: e.target.value })
    }
    style={{ padding: '5px' }}
  >
    <option value="theft">Theft</option>
    <option value="assault">Assault</option>
    <option value="fraud">Fraud</option>
    <option value="arson">Arson</option>
  </select>
</div>


<button
  className="gray-button"
  onClick={async () => {
    try {
      const res = await fetch(`http://localhost:4000/cases/${caseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (!res.ok) throw new Error('Failed to update case');

      alert('Case updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Update failed: ' + err.message);
    }
  }}
>
  Update Case
</button>



    </div>
  );
}

export default EditCase;
