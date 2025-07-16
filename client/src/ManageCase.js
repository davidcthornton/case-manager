// ManageCase.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function ManageCase() {
  const location = useLocation();
  const { caseNumber, eventDate, eventTime, crimeType } = location.state || {};

  return (
    <div className="Page">
      <h1>Manage Case</h1>
      <p><strong>Case Number:</strong> {caseNumber}</p>
      <p><strong>Date of Event:</strong> {eventDate}</p>
      <p><strong>Time of Event:</strong> {eventTime}</p>
      <p><strong>Crime Type:</strong> {crimeType}</p>
    </div>
  );
}

export default ManageCase;
