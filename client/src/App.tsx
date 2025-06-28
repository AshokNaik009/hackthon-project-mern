import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import API_BASE_URL from './config/api';

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Test API connection
    fetch(`${API_BASE_URL}/`)
      .then(res => res.json())
      .then(data => {
        setApiStatus(`✅ Connected: ${data.message}`);
      })
      .catch(err => {
        setApiStatus(`❌ Failed to connect: ${err.message}`);
      });

    // Fetch users
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data);
        }
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>MERN Hackathon Project</h1>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>API Status:</strong> {apiStatus}</p>
          <p><strong>API URL:</strong> {API_BASE_URL}</p>
        </div>
        <div>
          <h3>Users ({users.length})</h3>
          {users.length > 0 ? (
            <div style={{ textAlign: 'left', maxWidth: '400px' }}>
              {users.map((user: any, index: number) => (
                <div key={user._id || index} style={{ 
                  margin: '10px 0', 
                  padding: '10px', 
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found in database</p>
          )}
        </div>
        <p style={{ marginTop: '20px' }}>
          <a
            className="App-link"
            href={`${API_BASE_URL}/api-docs`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📖 View API Documentation
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
