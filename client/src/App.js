
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './auth';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';

import EditCase from './EditCase';
import NewCase from './NewCase';
import ManageCase from './ManageCase';
import CollectEvidence from './CollectEvidence';
import RemovableMediaInstructions from './RemovableMediaInstructions';
import SmartphoneInstructions from './smartphoneInstructions';
import DesktopLaptopConsoleInstructions from './DesktopLaptopConsoleInstructions';
import OtherInstructions from './OtherInstructions';

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
		fetch(serverURL + `/cases`, { credentials: "include" })
			.then(async (res) => {
				if (res.status === 401) {
					navigate("/login", { replace: true, state: { from: { pathname: "/" } } });
					return [];
				}
				return res.json();
			})
			.then((data) => setCases(Array.isArray(data) ? data : []))
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
		<AuthProvider>
			<>
				<Navbar />
				<Routes>
					{/* Public route */}
					<Route path="/login" element={<LoginPage />} />

					{/* Protected routes */}
					<Route path="/" element={
						<ProtectedRoute><Home /></ProtectedRoute>
					} />
					<Route path="/editcase" element={
						<ProtectedRoute><EditCase /></ProtectedRoute>
					} />
					<Route path="/newcase" element={
						<ProtectedRoute><NewCase /></ProtectedRoute>
					} />
					<Route path="/managecase" element={
						<ProtectedRoute><ManageCase /></ProtectedRoute>
					} />
					<Route path="/collectevidence" element={
						<ProtectedRoute><CollectEvidence /></ProtectedRoute>
					} />
					<Route path="/removablemediainstructions" element={
						<ProtectedRoute><RemovableMediaInstructions /></ProtectedRoute>
					} />
					<Route path="/smartphoneInstructions" element={
						<ProtectedRoute><SmartphoneInstructions /></ProtectedRoute>
					} />
					<Route path="/desktopLaptopConsoleInstructions" element={
						<ProtectedRoute><DesktopLaptopConsoleInstructions /></ProtectedRoute>
					} />
					<Route path="/otherInstructions" element={
						<ProtectedRoute><OtherInstructions /></ProtectedRoute>
					} />
				</Routes>
			</>
		</AuthProvider>
	);
}

export default App;