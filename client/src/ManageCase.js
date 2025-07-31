import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ManageCase = () => {
  const navigate = useNavigate();
  const { caseId } = useLocation().state || {};
  const [devices, setDevices] = useState([]);

  let serverURL;
  if (!process.env.REACT_APP_SERVER_URL) {
    serverURL = 'http://localhost:4000';
  } else {
    //serverURL = process.env.REACT_APP_SERVER_URL;
    serverURL = '/api';
  }
  //console.log("API base URL:", process.env.REACT_APP_SERVER_URL);
  //console.log("serverURL is " + serverURL);

  useEffect(() => {
    if (caseId) {
      fetch(serverURL + `/cases/${caseId}/devices`)
        .then(res => res.json())
        .then(data => setDevices(data))
        .catch(err => console.error('Failed to fetch devices:', err));
    }
  }, [caseId]);

  if (!caseId) return <p>No case selected.</p>;

  return (
    <div className="Page">
      <h1>Manage Case</h1>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: 'gray', marginTop: '-10px' }}>Case ID: {caseId}</h3>
      </div>
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
      <br /><br />

      <button
        className="gray-button"
        onClick={async () => {
          try {
            const res = await fetch(serverURL + `/cases/${caseId}/export`);
            if (!res.ok) throw new Error('Failed to download ZIP');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `case_${caseId}_evidence.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            alert(err.message);
          }
        }}
      >
        ⬇️ Download Evidence ZIP
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


              {Array.isArray(d.images) && d.images.length > 0 && (
                <div>
                  {d.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${serverURL}/${img.path.replace(/^\/+/, '')}`}
                      alt="evidence"
                      style={{ maxWidth: '200px', marginRight: '10px' }}
                    />
                  ))}
                </div>
              )}

            </li>
          ))}

        </ul>
      )}


      <br /><br />
      <button
        className="red-button"
        onClick={async () => {
          if (!window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) return;

          try {
            const res = await fetch(serverURL + `/cases/${caseId}`, {
              method: 'DELETE',
            });

            if (!res.ok) {
              throw new Error("Failed to delete the case.");
            }

            alert("Case deleted successfully.");
            navigate('/'); // Go back to the main page (App.js root)
          } catch (err) {
            alert(err.message);
          }
        }}
      >
        🗑️ Delete Case
      </button>

    </div>
  );
};

export default ManageCase;