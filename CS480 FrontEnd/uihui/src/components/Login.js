import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [nurseLoggedIn, setNurseLoggedIn] = useState(false);
  const [patientLoggedIn, setPatientLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleLogin = async () => {
    try {
      // Fetch the list of nurses
      const response = await fetch(`http://127.0.0.1:8000/api/nurses/`);
      
      if (response.ok) {
        const nurses = await response.json();

        // Check if there is a nurse with the input username and matching password
        const nurseMatch = nurses.find(nurse => nurse.username === username && nurse.password === password);

        if (nurseMatch && userType === 'nurse') {
          setNurseLoggedIn(true);
          console.log(`Successfully logged in as nurse with username: ${username}`);
        } else {
          // Fetch the list of patients
          const response = await fetch(`http://127.0.0.1:8000/api/patients/`);

          if (response.ok) {
            const patients = await response.json();

            // Check if there is a patient with the input username and matching password
            const patientMatch = patients.find(patient => patient.username === username && patient.password === password);

            if (patientMatch && userType === 'patient') {
              setPatientLoggedIn(true);
              console.log(`Successfully logged in as patient with username: ${username}`);
            } else if (username === 'Admin' && password === 'admin123' && userType === 'admin') {
              setAdminLoggedIn(true);
              console.log(`Successfully logged in as admin with username: ${username}`);
            } else {
              console.log('Invalid credentials');
            }
          } else {
            console.error('Failed to fetch patients');
          }
        }

      } else {
        console.error('Failed to fetch nurses');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const renderRegisterButton = () => {
    if (userType === 'patient') {
      return (
        <button onClick={handleRegister} style={{ marginTop: '10px', backgroundColor: 'green', color: 'white', cursor: 'pointer' }}>
          Register
        </button>
      );
    }
    return null;
  };

  const handleRegister = () => {
    // Implement registration logic here
    setRegistered(true);
    console.log('Registering as a patient');
  };

  // Redirect to AdminPage, NursePage, or PatientPage based on the loggedIn state
  if (adminLoggedIn) {
    return <Navigate to={`/admin/${username}`} />;
  } else if (nurseLoggedIn) {
    return <Navigate to={`/nurse/${username}`} />;
  } else if (patientLoggedIn) {
    return <Navigate to={`/patient/${username}`} />;
  } else if (registered) {
    return <Navigate to={'/register'} />;
  }

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        User Type:
        <select value={userType} onChange={(e) => setUserType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
          <option value="admin">Admin</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>
      </label>
      <button onClick={handleLogin} style={{ backgroundColor: '#007BFF', color: 'white', cursor: 'pointer', width: '100%', padding: '10px', border: 'none', borderRadius: '5px' }}>
        Login
      </button>
      {renderRegisterButton()}
    </div>
  );
};

export default Login;
