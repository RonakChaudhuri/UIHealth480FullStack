import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import NursePage from './components/NursePage';
import PatientPage from './components/PatientPage';
import RegisterPatient from './components/RegisterPatient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/nurse/:username" element={<NursePage />} />
        <Route path="/patient/:username" element={<PatientPage />} />
        <Route path="/register" element={<RegisterPatient />} />
      </Routes>
    </Router>
  );
}

export default App;
