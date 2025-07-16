// CollectEvidence.js
import React, { useState, useEffect } from 'react';

function CollectEvidence() {
  const [selectedItem, setSelectedItem] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');  

	useEffect(() => {
		const handleMessage = (event) => {
		  if (event.origin !== 'http://localhost:3001') return;

		  const { deviceName, deviceType } = event.data || {};

		  if (deviceName && deviceType) {
			setDeviceName(deviceName);
			setDeviceType(deviceType);
			setSelectedItem(deviceType); // auto-select dropdown if matched
		  }
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	  }, []);

  return (
    <div className="Page">
      <h1>Collect Evidence</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="evidence-select">Select Evidence Type:</label><br />
        <select
          id="evidence-select"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          style={{ padding: '5px', marginTop: '8px' }}
        >
          <option value="">-- Choose an item --</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Laptop">Laptop</option>
          <option value="Flash/Thumb Drive">Flash/Thumb Drive</option>
          <option value="External Drive">External Drive</option>
          <option value="Router">Router</option>
          <option value="Desktop">Desktop</option>
        </select>
      </div>

      {selectedItem && (
        <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
          Here are the instructions for collecting a <strong>{selectedItem}</strong>.
        </div>
      )}
	  
	  {deviceName && (
        <div style={{ marginTop: '10px', color: 'green' }}>
          Device identified: <strong>{deviceName}</strong> ({deviceType})
        </div>
      )}

      <button
        className="gray-button"
        onClick={() => window.open('http://localhost:3001/', '_blank')}
        style={{ marginTop: '30px' }}
      >
        Help me Identify
      </button>
    </div>
  );
}

export default CollectEvidence;
