import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const AdminPage = () => {

  const [logout, setLogout] = useState(false);
  // State for nurse form fields
  const [nurseFormData, setNurseFormData] = useState({
    fname: '',
    mi: '',
    lname: '',
    employee_id: '',
    age: '',
    gender: '',
    username: '',
    password: '',
  });

  // State for the list of nurses
  const [nurseList, setNurseList] = useState([]);

  // State to track the selected nurse ID
  const [selectedNurseId, setSelectedNurseId] = useState(null);

  const [nurseDetails, setNurseDetails] = useState({
    fname: '',
    mi: '',
    lname: '',
    employee_id: '',
    age: '',
    gender: '',
    username: '',
    password: '',
  });

  // Fetch the list of nurses when the component mounts
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/nurses/`);
        if (response.ok) {
          const nurses = await response.json();
          setNurseList(nurses);
        } else {
          console.error('Failed to fetch nurses');
        }
      } catch (error) {
        console.error('Error fetching nurses:', error);
      }
    };

    fetchNurses();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts


  const [vaccineFormData, setVaccineFormData] = useState({
    name: '',
    company_name: '',
    doses_required: '',
    description: '',
    quantity_in_repository: '',
  });

  // State for the list of vaccines
  const [vaccineList, setVaccineList] = useState([]);

  // State to track the selected vaccine ID
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);

  // Fetch the list of vaccines when the component mounts
    useEffect(() => {
        const fetchVaccines = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/vaccines/`);
            if (response.ok) {
            const vaccines = await response.json();
            setVaccineList(vaccines);
            } else {
            console.error('Failed to fetch vaccines');
            }
        } catch (error) {
            console.error('Error fetching vaccines:', error);
        }
        };
    
        fetchVaccines();
    }, []);


  // Function to handle nurse form input changes
  const handleNurseInputChange = (e) => {
    setNurseFormData({
      ...nurseFormData,
      [e.target.name]: e.target.value,
    });
  };

    // Function to handle nurse selection from the drop-down
  const handleNurseSelection = async (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedNurseId(selectedId);

    try {
    const response = await fetch(`${API_BASE_URL}/api/nurses/${selectedId}/`);
    if (response.ok) {
        const nurseDetailsData = await response.json();
        setNurseDetails(nurseDetailsData);
    } else {
        console.error('Failed to fetch nurse details');
    }
    } catch (error) {
    console.error('Error fetching nurse details:', error);
    }
  };

   // Function to handle updating a nurse's information
   const handleUpdateNurse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nurses/${selectedNurseId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nurseFormData),
      });

      if (response.ok) {
        console.log('Nurse updated successfully');
        // Optionally, reset the nurse form data and selected nurse ID
        setNurseDetails({
          fname: '',
          mi: '',
          lname: '',
          employee_id: '',
          age: '',
          gender: '',
          username: '',
          password: '',
        });
        setSelectedNurseId(null);
      } else {
        const errorData = await response.json(); // Try to parse error response
        console.error('Failed to update nurse:', errorData);
      }
    } catch (error) {
      console.error('Error updating nurse:', error);
    }
  };

  // Function to handle adding a nurse
  const handleAddNurse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/nurses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nurseFormData),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse error response
        console.error('Failed to add nurse:', errorData);
      } else {
        console.log('Nurse added successfully');
        setNurseFormData({
          fname: '',
          mi: '',
          lname: '',
          employee_id: '',
          age: '',
          gender: '',
          phone_number: '',
          address: '',
          username: '',
          password: '',
        });
      }
    } catch (error) {
      console.error('Error adding nurse:', error);
    }
  };

    // Function to handle deleting a nurse
    const handleDeleteNurse = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/nurses/${selectedNurseId}/`, {
            method: 'DELETE',
        });
    
        if (response.ok) {
            console.log('Nurse deleted successfully');
            // Optionally, reset the nurse details, form data, and selected nurse ID
            setNurseDetails(null);
            setNurseFormData({
            fname: '',
            mi: '',
            lname: '',
            employee_id: '',
            age: '',
            gender: '',
            username: '',
            password: '',
            });
            setSelectedNurseId(null);
        } else {
            const errorData = await response.json(); // Try to parse error response
            console.error('Failed to delete nurse:', errorData);
        }
        } catch (error) {
        console.error('Error deleting nurse:', error);
        }
    };
  
    const [nurseScheduledTimes, setNurseScheduledTimes] = useState([]);

    useEffect(() => {
      const fetchAllNurseSchedules = async () => {
        try {
          // Fetch all nurse schedules
          const response = await fetch(`${API_BASE_URL}/api/nurseschedulings/`);
          
          if (response.ok) {
            const allNurseSchedules = await response.json();
  
            // Filter nurse schedules based on nurse ID
            const nurseSchedules = allNurseSchedules.filter(
              scheduling => scheduling.nurse === selectedNurseId
            );
  
            // Extract time slot IDs
            const timeSlotIds = nurseSchedules.map(scheduling => scheduling.time_slot);
  
            // Fetch corresponding start times from time slot IDs
            const startTimesResponse = await Promise.all(
              timeSlotIds.map(async timeSlotId => {
                const timeSlotResponse = await fetch(`${API_BASE_URL}/api/timeslots/${timeSlotId}/`);
                const timeSlotData = await timeSlotResponse.json();
                return timeSlotData.start_time;
              })
            );
  
            setNurseScheduledTimes(startTimesResponse);
          } else {
            console.error('Failed to fetch nurse scheduling:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching nurse scheduling:', error);
        }
      };
  
      fetchAllNurseSchedules();
    }, [selectedNurseId]);

    // Function to handle vaccine form input changes
  const handleVaccineInputChange = (e) => {
    setVaccineFormData({
      ...vaccineFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to fetch vaccine details by ID
const fetchVaccineDetails = async (vaccineId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vaccines/${vaccineId}`);
      if (response.ok) {
        const vaccineDetails = await response.json();
        // Set the fetched details to the vaccineFormData state
        setVaccineFormData(vaccineDetails);
      } else {
        console.error('Failed to fetch vaccine details');
      }
    } catch (error) {
      console.error('Error fetching vaccine details:', error);
    }
  };
  
  // Function to handle vaccine selection from the drop-down
  const handleVaccineSelection = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedVaccineId(selectedId);
  
    // Fetch the details of the selected vaccine
    if (selectedId) {
      fetchVaccineDetails(selectedId);
    }
  };

  // Function to handle updating a vaccine's information
  const handleUpdateVaccine = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vaccines/${selectedVaccineId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vaccineFormData),
      });

      if (response.ok) {
        console.log('Vaccine updated successfully');
        // Optionally, reset the vaccine form data and selected vaccine ID
        setVaccineFormData({
          name: '',
          company_name: '',
          doses_required: '',
          description: '',
          quantity_in_repository: '',
        });
        setSelectedVaccineId(null);
      } else {
        const errorData = await response.json(); // Try to parse error response
        console.error('Failed to update vaccine:', errorData);
      }
    } catch (error) {
      console.error('Error updating vaccine:', error);
    }
  };

  // Function to handle adding a new vaccine
  const handleAddVaccine = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vaccines/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vaccineFormData),
      });

      if (response.ok) {
        console.log('Vaccine added successfully');
        // Optionally, reset the vaccine form data
        setVaccineFormData({
          name: '',
          company_name: '',
          doses_required: '',
          description: '',
          quantity_in_repository: '',
        });
      } else {
        const errorData = await response.json(); // Try to parse error response
        console.error('Failed to add vaccine:', errorData);
      }
    } catch (error) {
      console.error('Error adding vaccine:', error);
    }
  };

  // State for the list of patients
  const [patientList, setPatientList] = useState([]);

  // State to track the selected patient ID
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // State for patient details
  const [patientDetails, setPatientDetails] = useState({
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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/patients/`);
        if (response.ok) {
          const patients = await response.json();
          setPatientList(patients);
        } else {
          console.error('Failed to fetch patients');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Function to handle patient selection from the drop-down
  // Function to handle patient selection from the drop-down
  const handlePatientSelection = async (e) => {
    const selectedId = parseInt(e.target.value, 10);
    setSelectedPatientId(selectedId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${selectedId}/`);
      if (response.ok) {
        const patientDetailsData = await response.json();
        setPatientDetails(patientDetailsData);
      } else {
        console.error('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [selectedScheduledTime, setSelectedScheduledTime] = useState('');
  const [startTimes, setStartTimes] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);

  useEffect(() => {
    const fetchScheduledTimes = async () => {
      try {
        // Fetch all vaccination schedules
        const response = await fetch(`${API_BASE_URL}/api/vaccinationschedules/`);
        if (response.ok) {
          const schedulesData = await response.json();

          // Filter schedules that match the patientId
          const patientSchedules = schedulesData.filter((schedule) => schedule.patient === selectedPatientId);
          setScheduledTimes(patientSchedules);

          // Fetch and set start times for each schedule
          const startTimePromises = patientSchedules.map(async (schedule) => {
            const response = await fetch(`${API_BASE_URL}/api/timeslots/${schedule.time_slot}/`);
            if (response.ok) {
              const timeSlotData = await response.json();
              return timeSlotData.start_time;
            } else {
              console.error('Failed to fetch start time for time slot ID:', schedule.time_slot);
              return 'Unknown Start Time';
            }
          });

          const resolvedStartTimes = await Promise.all(startTimePromises);
          setStartTimes(resolvedStartTimes);
        } else {
          console.error('Failed to fetch vaccination schedules');
        }
      } catch (error) {
        console.error('Error fetching vaccination schedules:', error);
      }
    };

    fetchScheduledTimes();
  }, [selectedPatientId]);

  useEffect(() => {
    const fetchVaccinationHistory = async () => {
      try {
        // Fetch all vaccination records
        const response = await fetch(`${API_BASE_URL}/api/vaccinationrecords/`);
        if (response.ok) {
          const recordsData = await response.json();

          // Filter records that match the patientId
          const patientRecords = recordsData.filter((record) => record.patient === selectedPatientId);

          // Fetch additional details for each record
          const detailedRecords = await Promise.all(
            patientRecords.map(async (record) => {
              const vaccineResponse = await fetch(`${API_BASE_URL}/api/vaccines/${record.vaccine}/`);
              const nurseResponse = await fetch(`${API_BASE_URL}/api/nurses/${record.nurse}/`);
              const timeSlotResponse = await fetch(`${API_BASE_URL}/api/timeslots/${record.time_slot}/`);

              if (vaccineResponse.ok && nurseResponse.ok && timeSlotResponse.ok) {
                const vaccineData = await vaccineResponse.json();
                const nurseData = await nurseResponse.json();
                const timeSlotData = await timeSlotResponse.json();

                return {
                  ...record,
                  vaccineName: vaccineData.name,
                  nurseName: `${nurseData.fname} ${nurseData.lname}`,
                  startTime: timeSlotData.start_time,
                };
              } else {
                console.error('Failed to fetch additional details for a record');
                return null;
              }
            })
          );

          setVaccinationHistory(detailedRecords.filter(Boolean));
        } else {
          console.error('Failed to fetch vaccination records');
        }
      } catch (error) {
        console.error('Error fetching vaccination records:', error);
      }
    };

    fetchVaccinationHistory();
  }, [selectedPatientId]);


  const handleLogout = () => {
    setLogout(true);
  };

  if(logout) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <button
        style={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={handleLogout}
      >
                Logout
      </button>
      <h1>Admin Page</h1>
      <h2>Add Nurse</h2>
      <form>
        {/* Add input fields for nurse details */}
        <label>
          First Name:
          <input type="text" name="fname" value={nurseFormData.fname} onChange={handleNurseInputChange} />
        </label>
        <label>
          Middle Initial:
          <input type="text" name="mi" value={nurseFormData.mi} onChange={handleNurseInputChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lname" value={nurseFormData.lname} onChange={handleNurseInputChange} />
        </label>
        <label>
          Employee ID:
          <input type="text" name="employee_id" value={nurseFormData.employee_id} onChange={handleNurseInputChange} />
        </label>
        <label>
          Age:
          <input type="text" name="age" value={nurseFormData.age} onChange={handleNurseInputChange} />
        </label>
        <label>
          Gender:
          <input type="text" name="gender" value={nurseFormData.gender} onChange={handleNurseInputChange} />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={nurseFormData.username} onChange={handleNurseInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={nurseFormData.password} onChange={handleNurseInputChange} />
        </label>

        {/* Button to add nurse */}
        <button type="button" onClick={handleAddNurse}>
          Add Nurse
        </button>
        </form>
        <h2>Update Nurse Details</h2>
        <form>
        {/* Drop-down menu for selecting a nurse */}
        <label>
            Select Nurse:
            <select onChange={handleNurseSelection} value={selectedNurseId || ''}>
            <option value="" disabled>Select Nurse</option>
            {nurseList.map((nurse) => (
                <option key={nurse.nurse_id} value={nurse.nurse_id}>
                {`${nurse.fname} ${nurse.lname}`}
                </option>
            ))}
            </select>
        </label>

        {/* Display nurse details for selected nurse */}
        {selectedNurseId && (
            <div>
            <label>
                First Name:
                <input type="text" name="fname" value={nurseDetails.fname} onChange={handleNurseInputChange} />
            </label>
            <label>
                Middle Initial:
                <input type="text" name="mi" value={nurseDetails.mi} onChange={handleNurseInputChange} />
            </label>
            <label>
                Last Name:
                <input type="text" name="lname" value={nurseDetails.lname} onChange={handleNurseInputChange} />
            </label>
            <label>
                Employee ID:
                <input type="text" name="employee_id" value={nurseDetails.employee_id} onChange={handleNurseInputChange} />
            </label>
            <label>
                Age:
                <input type="text" name="age" value={nurseDetails.age} onChange={handleNurseInputChange} />
            </label>
            <label>
                Gender:
                <input type="text" name="gender" value={nurseDetails.gender} onChange={handleNurseInputChange} />
            </label>
            <label>
                Username:
                <input type="text" name="username" value={nurseDetails.username} onChange={handleNurseInputChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password" value={nurseDetails.password} onChange={handleNurseInputChange} />
            </label>

            {/* Button to update nurse */}
            <button type="button" onClick={handleUpdateNurse} disabled={!selectedNurseId}>
                Update Nurse
            </button>
            {/* Button to delete nurse */}
            <button type="button" onClick={handleDeleteNurse} disabled={!selectedNurseId}>
            Delete Nurse
            </button>
            </div>
        )}
        </form>
        <h2>View Nurse Scheduled Times</h2>
        <label>
            <select>
            <option value="">Select...</option>
            {nurseScheduledTimes.map((time, index) => (
                <option key={index} value={time}>
                {new Date(time).toLocaleString()}
                </option>
            ))}
            </select>
        </label>
        {/* Add Vaccine Form */}
      <h2>Add Vaccine</h2>
      <form>
        {/* Add input fields for vaccine details */}
        <label>
          Name:
          <input type="text" name="name" value={vaccineFormData.name} onChange={handleVaccineInputChange} />
        </label>
        <label>
          Company Name:
          <input type="text" name="company_name" value={vaccineFormData.company_name} onChange={handleVaccineInputChange} />
        </label>
        <label>
          Doses Required:
          <input type="text" name="doses_required" value={vaccineFormData.doses_required} onChange={handleVaccineInputChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={vaccineFormData.description} onChange={handleVaccineInputChange} />
        </label>
        <label>
          Quantity in Repository:
          <input type="number" name="quantity_in_repository" value={vaccineFormData.quantity_in_repository} onChange={handleVaccineInputChange} />
        </label>

        {/* Button to add vaccine */}
        <button type="button" onClick={handleAddVaccine}>
          Add Vaccine
        </button>
      </form>
      {/* Update Vaccine Form */}
      <h2>Update Vaccine Details</h2>
      <form>
        {/* Drop-down menu for selecting a vaccine */}
        <label>
          Select Vaccine:
          <select onChange={handleVaccineSelection} value={selectedVaccineId || ''}>
            <option value="" disabled>Select Vaccine</option>
            {vaccineList.map((vaccine) => (
              <option key={vaccine.vaccine_id} value={vaccine.vaccine_id}>
                {vaccine.name}
              </option>
            ))}
          </select>
        </label>

        {/* Display vaccine details for the selected vaccine */}
        {selectedVaccineId && (
          <div>
            <label>
              Name:
              <input type="text" name="name" value={vaccineFormData.name} onChange={handleVaccineInputChange} />
            </label>
            <label>
              Company Name:
              <input type="text" name="company_name" value={vaccineFormData.company_name} onChange={handleVaccineInputChange} />
            </label>
            <label>
              Doses Required:
              <input type="text" name="doses_required" value={vaccineFormData.doses_required} onChange={handleVaccineInputChange} />
            </label>
            <label>
              Description:
              <textarea name="description" value={vaccineFormData.description} onChange={handleVaccineInputChange} />
            </label>
            <label>
              Quantity in Repository:
              <input type="number" name="quantity_in_repository" value={vaccineFormData.quantity_in_repository} onChange={handleVaccineInputChange} />
            </label>

            {/* Button to update vaccine */}
            <button type="button" onClick={handleUpdateVaccine} disabled={!selectedVaccineId}>
              Update Vaccine
            </button>
          </div>
        )}
      </form>
      <h2>View Patient Details</h2>
      <form>
        {/* Drop-down menu for selecting a patient */}
        <label>
          Select Patient:
          <select onChange={handlePatientSelection} value={selectedPatientId || ''}>
            <option value="" disabled>Select Patient</option>
            {patientList.map((patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {`${patient.fname} ${patient.lname}`}
              </option>
            ))}
          </select>
        </label>

        {/* Display patient details for the selected patient */}
        {selectedPatientId && (
          <div style={{ marginTop: '10px' }}>
            <label>
              First Name: {patientDetails.fname}
            </label>
            <br />
            <label>
              Middle Initial: {patientDetails.mi}
            </label>
            <br />
            <label>
              Last Name: {patientDetails.lname}
            </label>
            <br />
            <label>
              SSN: {patientDetails.ssn}
            </label>
            <br />
            <label>
              Age: {patientDetails.age}
            </label>
            <br />
            <label>
              Gender: {patientDetails.gender}
            </label>
            <br />
            <label>
              Race: {patientDetails.race}
            </label>
            <br />
            <label>
              Occupation Class: {patientDetails.occupation_class}
            </label>
            <br />
            <label>
              Medical History: {patientDetails.medical_history}
            </label>
            <br />
            <label>
              Phone Number: {patientDetails.phone_number}
            </label>
            <br />
            <label>
              Address: {patientDetails.address}
            </label>
            <br />
            <label>
              Username: {patientDetails.username}
            </label>
            <br />
            <label>
              Password: {patientDetails.password}
            </label>
          </div>
        )}
      </form>
      <h2>Scheduled Times</h2>
      <label>
        View Scheduled Times:
        <select
          value={selectedScheduledTime}
          onChange={(e) => setSelectedScheduledTime(e.target.value)}
        >
          <option value="">Select a Scheduled Time</option>
          {startTimes.map((startTime, index) => (
            <option key={scheduledTimes[index].schedule_id} value={scheduledTimes[index].time_slot}>
              {startTime}
            </option>
          ))}
        </select>
      </label>
      <h2>Vaccination History</h2>
      <ul>
        {vaccinationHistory.map((record) => (
          <li key={record.record_id}>
            <strong>Vaccine:</strong> {record.vaccineName}, 
            <strong> Dose Given:</strong> {record.dose_given},
            <strong> Nurse:</strong> {record.nurseName},
            <strong> Time Slot:</strong> {record.startTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
