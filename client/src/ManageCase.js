
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function ManageCase() {
	const location = useLocation();
  const navigate = useNavigate();	
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('caseData');
	console.log(stored)
    if (stored) {
      setCaseData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="Page">
      <h1>Manage Case</h1>
      {caseData ? (
        <>
          <p><strong>Case Number:</strong> {caseData.caseNumber}</p>
          <p><strong>Date:</strong> {caseData.eventDate}</p>
          <p><strong>Time:</strong> {caseData.eventTime}</p>
          <p><strong>Crime Type:</strong> {caseData.crimeType}</p>
        </>
      ) : (
        <p>No case data found in session.</p>
      )}
	  
	  <br />
      <button
        className="gray-button"
        onClick={() => navigate('/collectevidence')}
      >
        Collect Evidence
      </button>
    </div>
  );
}

export default ManageCase;


