import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEVICE_TYPES = [
  'desktop',
  'laptop',
  'smartphone',
  'tablet',
  'externaldrive',
  'removablemedia',
  'router',
  'other'
];

const INSTRUCTION_ROUTES = {
  smartphone: '/smartphoneInstructions',
  laptop: '/laptopInstructions',
  removablemedia: '/removableMediaInstructions',
  externaldrive: '/removableMediaInstructions',
  router: '/routerInstructions',
  desktop: '/desktopInstructions',
  tablet: '/tabletInstructions',
  other: '/otherInstructions',
};

const CollectEvidence = () => {
  const { caseId } = useLocation().state || {};
  const navigate = useNavigate();

	const [imageFile, setImageFile] = useState(null);

  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [wasIdentified, setWasIdentified] = useState(false);

  // Handle messages from identification tool
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'http://localhost:3001') return;
      const { deviceName, deviceType } = event.data || {};

      if (deviceName && deviceType) {
        setDeviceName(deviceName);
        setDeviceType(deviceType);
        setWasIdentified(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

 const handleSubmit = async () => {
  if (!caseId || !deviceName || !deviceType) {
    alert('Please fill in all fields.');
    return;
  }

  const formData = new FormData();
  formData.append('name', deviceName);
  formData.append('type', deviceType);
  formData.append('collectedAt', new Date().toISOString());
  formData.append('caseId', caseId);
  if (imageFile) formData.append('image', imageFile);

  try {
    const res = await fetch('http://localhost:4000/devices', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to collect device');
    alert('Device collected successfully!');
    navigate('/managecase', { state: { caseId } });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  if (!caseId) return <p>No case selected.</p>;

  const instructionPath = INSTRUCTION_ROUTES[deviceType.toLowerCase()] || null;

  return (
    <div className="Page">
      <h1>Collect Evidence</h1>
      <p>For Case ID: {caseId}</p>

      <div style={{ marginBottom: '20px' }}>
        <label>Device Name:</label><br />
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
      </div>
	  
	  <div style={{ marginBottom: '20px' }}>
		  <label>Upload Image:</label><br />
		  <input
			type="file"
			accept="image/*"
			onChange={(e) => setImageFile(e.target.files[0])}
		  />
		</div>


      <div style={{ marginBottom: '20px' }}>
        <label>Device Type:</label><br />
        <select
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="">-- Select Type --</option>
          {DEVICE_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {instructionPath && (
        <div style={{ marginTop: '10px' }}>
          <button
            className="gray-button"
            onClick={() => navigate(instructionPath)}
          >
            📄 Collection Instructions
          </button>
        </div>
      )}

      {wasIdentified && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          Device identified: <strong>{deviceName}</strong> ({deviceType})
        </div>
      )}

      <button
        className="gray-button"
        onClick={() => window.open('http://localhost:3001/', '_blank')}
        style={{ marginTop: '30px' }}
      >
        🧠 Help Me Identify
      </button>

      <br /><br />

      <button className="gray-button" onClick={handleSubmit}>
        ✅ Collect
      </button>
    </div>
  );
};

export default CollectEvidence;
