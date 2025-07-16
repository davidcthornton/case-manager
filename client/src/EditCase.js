// EditCase.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function EditCase() {
  const location = useLocation();
  const { caseId } = location.state || {};

  return (
    <div className="Page">
      <h1>Edit Case</h1>
      {caseId ? (
        <p>You're editing: <strong>{caseId}</strong></p>
      ) : (
        <p>No case selected.</p>
      )}
    </div>
  );
}

export default EditCase;
