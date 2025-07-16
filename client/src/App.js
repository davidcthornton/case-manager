// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Page1 from './Page1';
import Page2 from './Page2';
import EditCase from './EditCase';
import NewCase from './NewCase';
import ManageCase from './ManageCase';
import CollectEvidence from './CollectEvidence';



import './App.css';

import folderIcon from './assets/folder.svg';


function Home() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('');



  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div className="Page">
	  <h1>Case Manager 1.0</h1>
      <button onClick={() => navigate('/newcase')} class="gray-button">
		<img src={folderIcon} alt="folder icon" class="icon" style={{ width: '30px', height: '30px' }} />
			Start New Case
			</button>
      
		<div style={{ marginTop: '40px' }}>
		  <label htmlFor="case-select">Select Case to Edit:</label>
		  <select
			id="case-select"
			value={selectedItem}
			onChange={(e) => setSelectedItem(e.target.value)}
			style={{ marginLeft: '10px', padding: '5px' }}
		  >
			<option value="">-- Choose a case --</option>
			<option value="case1">Case 001</option>
			<option value="case2">Case 002</option>
			<option value="case3">Case 003</option>
		  </select>

		  <br /><br />

		  <button
			className="gray-button"
			onClick={() => {
			  if (!selectedItem) {
				alert("Please select a case to edit.");
				return;
			  }
			  navigate('/editcase', { state: { caseId: selectedItem } });
			}}
		  >
			Edit Case
		  </button>
		</div>

		
  
	  
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
	  <Route path="/editcase" element={<EditCase />} />
	  <Route path="/newcase" element={<NewCase />} />
	<Route path="/managecase" element={<ManageCase />} /> 
	<Route path="/collectevidence" element={<CollectEvidence />} />
	
    </Routes>
  );
}

export default App;
