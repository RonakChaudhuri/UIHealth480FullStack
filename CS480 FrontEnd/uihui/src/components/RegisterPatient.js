import React, { useState } from 'react';
import API_BASE_URL from '../config';
import { Link } from 'react-router-dom';

const RegisterPatient = () => {
  const [patientInfo, setPatientInfo] = useState({
    fname: '',
    mi: '',
    lname: '',
    ssn: '',
    age: '',
    gender: '',
    race: '',
    occupation_class: '',
    medical_history: '',
    phone_number: '',
    address: '',
    username: '',
    password: '',
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      // Send a request to register the patient
      const response = await fetch(`${API_BASE_URL}/api/patients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientInfo),
      });

      if (response.ok) {
        console.log('Patient registered successfully');
        setRegistrationSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to register patient:', errorData);
      }
    } catch (error) {
      console.error('Error during patient registration:', error);
    }
  };

  const handleInputChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Register Patient</h2>
      <form>
        <label>
          First Name:
          <input type="text" name="fname" value={patientInfo.fname} onChange={handleInputChange} />
        </label>
        <label>
          Middle Initial:
          <input type="text" name="mi" value={patientInfo.mi} onChange={handleInputChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lname" value={patientInfo.lname} onChange={handleInputChange} />
        </label>
        <label>
          SSN:
          <input type="text" name="ssn" value={patientInfo.ssn} onChange={handleInputChange} />
        </label>
        <label>
          Age:
          <input type="text" name="age" value={patientInfo.age} onChange={handleInputChange} />
        </label>
        <label>
          Gender:
          <input type="text" name="gender" value={patientInfo.gender} onChange={handleInputChange} />
        </label>
        <label>
          Race:
          <input type="text" name="race" value={patientInfo.race} onChange={handleInputChange} />
        </label>
        <label>
          Occupation Class:
          <input type="text" name="occupation_class" value={patientInfo.occupation_class} onChange={handleInputChange} />
        </label>
        <label>
          Medical History:
          <textarea name="medical_history" value={patientInfo.medical_history} onChange={handleInputChange}></textarea>
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" value={patientInfo.phone_number} onChange={handleInputChange} />
        </label>
        <label>
          Address:
          <textarea name="address" value={patientInfo.address} onChange={handleInputChange}></textarea>
        </label>
        <label>
          Username:
          <input type="text" name="username" value={patientInfo.username} onChange={handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={patientInfo.password} onChange={handleInputChange} />
        </label>

        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
      {registrationSuccess && <p>Registration successful! <Link to="/">Login</Link></p>}
    </div>
  );
};

export default RegisterPatient;
