import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEVICE_TYPES = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'externaldrive', label: 'External Drive' },
  { value: 'removablemedia', label: 'Removable Media' },
  { value: 'router', label: 'Router' },
  { value: 'other', label: 'Other' },
];

const INSTRUCTION_ROUTES = {
  smartphone: '/smartphoneInstructions.html',
  laptop: '/desktopLaptopConsoleInstructions.html',
  removablemedia: '/removableMediaInstructions.html',
  externaldrive: '/removableMediaInstructions.html',
  router: '/otherInstructions.html',
  desktop: '/desktopLaptopConsoleInstructions.html',
  tablet: '/smartphoneInstructions.html',
  other: '/otherInstructions.html',
};

const CollectEvidence = () => {
  const { caseId } = useLocation().state || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [wasIdentified, setWasIdentified] = useState(false);  
  const appendImages = (files) => {
    const asArray = Array.from(files || []);
    setImageFile((prev) => [...prev, ...asArray]);
  };


  let serverURL;
  if (!process.env.REACT_APP_SERVER_URL) {
    serverURL = 'http://localhost:4000';
  } else {
    //serverURL = process.env.REACT_APP_SERVER_URL;
    serverURL = '/api';
  }
  //console.log("API base URL:", process.env.REACT_APP_SERVER_URL);
  //console.log("serverURL is " + serverURL);

  let deviceIdFrontEndURL;
  if (!process.env.REACT_APP_DEVICE_ID_FRONTEND) {
    deviceIdFrontEndURL = 'http://localhost:3001';
  } else {
    //deviceIdFrontEndURL = process.env.REACT_APP_DEVICE_ID_FRONTEND;
    deviceIdFrontEndURL = 'https://deviceidentifier.gamificationsoftware.org';
  }
  //console.log("device id front end URL:", process.env.REACT_APP_DEVICE_ID_FRONTEND);
  //console.log("serverURL is " + deviceIdFrontEndURL);


  // Handle messages from identification tool
  useEffect(() => {
    const handleMessage = (event) => {
      console.log(event.origin);
      if (event.origin !== deviceIdFrontEndURL) return;
      const { deviceName, deviceType, images } = event.data || {};


      // Update fields if provided
      if (deviceName) setDeviceName(deviceName);
      if (deviceType) setDeviceType(deviceType);

      // NEW: accept optional array of File/Blob objects
      if (Array.isArray(images) && images.length) {
        // If they’re File/Blob instances, we can store them as-is.
        setImageFile(images);
      }
      if (deviceName || deviceType || (images && images.length)) {
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

    setLoading(true); // start loading


    const formData = new FormData();
    formData.append('name', deviceName);
    formData.append('type', deviceType);
    formData.append('collectedAt', new Date().toISOString());
    formData.append('caseId', caseId);
    imageFile.forEach((file, idx) => {
      formData.append('images', file); // Append with same name 'images'
    });


    try {
      const res = await fetch(serverURL + `/devices`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to collect device');
      alert('Device collected successfully!');
      navigate('/managecase', { state: { caseId } });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false); // stop loading
    }

  };


  if (!caseId) return <p>No case selected.</p>;

  const instructionPath = INSTRUCTION_ROUTES[deviceType.toLowerCase()] || null;

  return (
    <div className="Page">
      <h1>Collect Evidence</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Device Type:</label><br />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            style={{ padding: '5px' }}
          >
            <option value="">-- Select Type --</option>
            {DEVICE_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <button
            className="gray-button"
            onClick={() => window.open(deviceIdFrontEndURL, '_blank')}
          >
            🧠 Help Me Identify
          </button>
        </div>
      </div>


      <div style={{ marginBottom: '20px' }}>
        <label>Upload Image:</label><br />

        {/* Regular file picker (folders, gallery, etc.) */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => appendImages(e.target.files)}
        />

        {/* Hidden camera capture input */}
        <input
          id="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"    // rear camera when available
          multiple                  // some mobile browsers ignore multiple; safe to include
          style={{ display: 'none' }}
          onChange={(e) => appendImages(e.target.files)}
        />

        {/* Visible button to trigger camera */}
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            className="gray-button"
            onClick={() => document.getElementById('cameraInput')?.click()}
          >
            📷 Take Photos
          </button>
        </div>

        {imageFile.length > 0 && (
          <p style={{ marginTop: 8 }}>
            {`Selected ${imageFile.length} image${imageFile.length > 1 ? 's' : ''}`}
          </p>
        )}
      </div>


      {instructionPath && (
        <div style={{ marginTop: '10px' }}>
          <button
            className="gray-button"
            onClick={() => window.open(instructionPath, '_blank', 'noopener,noreferrer')}
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

      <br /><br />

      <button className="gray-button" onClick={handleSubmit} disabled={loading}>
        {loading ? '⏳ Collecting...' : '✅ Collect'}
      </button>

    </div>
  );
};

export default CollectEvidence;
