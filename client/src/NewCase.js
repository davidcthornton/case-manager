// NewCase.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewCase() {
  const navigate = useNavigate();
  const [caseNumber, setCaseNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [crimeType, setCrimeType] = useState('');

  let serverURL;
  if (!process.env.SERVER_URL) {
    serverURL = 'http://localhost:4000';
  } else {
    serverURL = process.env.SERVER_URL;
  }
  console.log("API base URL:", process.env.SERVER_URL);
  console.log("serverURL is " + serverURL);

  const handleSubmit = async () => {
    if (!caseNumber || !eventDate || !eventTime || !crimeType) {
      alert("Please fill in all fields.");
      return;
    }

    const caseData = {
      caseNumber,
      eventDate,
      eventTime,
      crimeType
    };

    try {
      const res = await fetch(serverURL + `/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Unknown error');
      }

      const saved = await res.json();
      console.log('Case saved:', saved);

      // Optional: keep session storage if needed
      sessionStorage.setItem('caseData', JSON.stringify(saved));

      //navigate('/managecase');
      navigate('/managecase', { state: { caseId: saved.id } });

    } catch (error) {
      console.error('Failed to create case:', error);
      alert(`Failed to create case: ${error.message}`);
    }
  };



  return (
    <div className="Page">
      <h1>Create New Case</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Case Number:</label><br />
        <input
          type="text"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          style={{ width: '200px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Date of Event:</label><br />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Time of Event:</label><br />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Crime Type:</label><br />
        <select
          value={crimeType}
          onChange={(e) => setCrimeType(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="">-- Select Type --</option>
          <option value="theft">Theft</option>
          <option value="assault">Assault</option>
          <option value="fraud">Fraud</option>
          <option value="arson">Arson</option>
        </select>
      </div>

      <button className="gray-button" onClick={handleSubmit}>
        Create Case
      </button>
    </div>
  );
}

export default NewCase;
