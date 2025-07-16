// NewCase.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewCase() {
  const navigate = useNavigate();

  const [caseNumber, setCaseNumber] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [crimeType, setCrimeType] = useState('');

  const handleSubmit = () => {
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

	  sessionStorage.setItem('caseData', JSON.stringify(caseData));

    navigate('/managecase');
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
