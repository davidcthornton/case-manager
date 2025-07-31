
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EditCase from './EditCase';
import NewCase from './NewCase';
import ManageCase from './ManageCase';
import CollectEvidence from './CollectEvidence';
import RemovableMediaInstructions from './RemovableMediaInstructions';
import SmartphoneInstructions from './smartphoneInstructions';
import Navbar from './Navbar';
import './App.css';
import folderIcon from './assets/folder.svg';


function Home() {
	const [message, setMessage] = useState('');
	const navigate = useNavigate();
	const [selectedItem, setSelectedItem] = useState('');
	const [users, setUsers] = useState([]);
	const [cases, setCases] = useState([]);

	let serverURL;
	if (!process.env.REACT_APP_SERVER_URL) {
		serverURL = 'http://localhost:4000';
	} else {
		//serverURL = process.env.REACT_APP_SERVER_URL;
		serverURL = '/api';
	}
	//console.log("API base URL:", process.env.REACT_APP_SERVER_URL);
	//console.log("the serverURL is " + serverURL);

	useEffect(() => {
		fetch(serverURL + `/cases`)
			.then(res => res.json())
			.then(data => setCases(data))
			.catch(err => console.error('Error loading cases:', err));
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
					{cases.map((c) => (
						<option key={c.id} value={c.id}>
							{c.caseNumber}
						</option>
					))}
				</select>

				<br /><br />

				<button
					className="gray-button"
					onClick={() => {
						if (!selectedItem) {
							alert("Please select a case to manage.");
							return;
						}
						navigate('/managecase', { state: { caseId: selectedItem } });
					}}
				>
					Manage Case
				</button>

			</div>

		</div>
	);
}


function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/editcase" element={<EditCase />} />
				<Route path="/newcase" element={<NewCase />} />
				<Route path="/managecase" element={<ManageCase />} />
				<Route path="/collectevidence" element={<CollectEvidence />} />
				<Route path="/removablemediainstructions" element={<RemovableMediaInstructions />} />
				<Route path="/smartphoneInstructions" element={<SmartphoneInstructions />} />
			</Routes>
		</>
	);
}

export default App;