import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { Navigate, useParams } from 'react-router-dom';

const PatientPage = () => {
  const [logout, setLogout] = useState(false);
  const { username } = useParams();

  const [patientId, setPatientId] = useState(null);

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

  const [timeslots, setTimeslots] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [doseOnHold, setDoseOnHold] = useState('');

  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [selectedScheduledTime, setSelectedScheduledTime] = useState('');
  const [startTimes, setStartTimes] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/patients/`);
        if (response.ok) {
          const patientsData = await response.json();
          const matchingPatient = patientsData.find((patient) => patient.username === username);

          if (matchingPatient) {
            setPatientInfo(matchingPatient);
            setPatientId(matchingPatient.patient_id);
          } else {
            console.error('Patient not found');
          }
        } else {
          console.error('Failed to fetch patients');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatientInfo();
  }, [username]);

  useEffect(() => {
    const fetchTimeslotsAndVaccines = async () => {
      try {
        // Fetch timeslots
        const timeslotsResponse = await fetch(`${API_BASE_URL}/api/timeslots/`);
        if (timeslotsResponse.ok) {
          const timeslotsData = await timeslotsResponse.json();
          setTimeslots(timeslotsData);
        } else {
          console.error('Failed to fetch timeslots');
        }

        // Fetch vaccines
        const vaccinesResponse = await fetch(`${API_BASE_URL}/api/vaccines/`);
        if (vaccinesResponse.ok) {
          const vaccinesData = await vaccinesResponse.json();
          setVaccines(vaccinesData);
        } else {
          console.error('Failed to fetch vaccines');
        }
      } catch (error) {
        console.error('Error fetching timeslots and vaccines:', error);
      }
    };

    fetchTimeslotsAndVaccines();
  }, []);

  useEffect(() => {
    const fetchScheduledTimes = async () => {
      try {
        // Fetch all vaccination schedules
        const response = await fetch(`${API_BASE_URL}/api/vaccinationschedules/`);
        if (response.ok) {
          const schedulesData = await response.json();

          // Filter schedules that match the patientId
          const patientSchedules = schedulesData.filter((schedule) => schedule.patient === patientId);
          setScheduledTimes(patientSchedules);
        } else {
          console.error('Failed to fetch vaccination schedules');
        }
      } catch (error) {
        console.error('Error fetching vaccination schedules:', error);
      }
    };

    fetchScheduledTimes();
  }, [patientId]);

  const handleUpdateInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/patients/${patientId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientInfo),
      });

      if (response.ok) {
        console.log('Patient information updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update patient information:', errorData);
      }
    } catch (error) {
      console.error('Error updating patient information:', error);
    }
  };

  const handleInputChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleVaccination = async () => {
    try {
      // Check if both timeslot and vaccine are selected
      if (!selectedTimeslot || !selectedVaccine) {
        console.error('Please select a timeslot and a vaccine');
        return;
      }

      // Send a request to schedule the vaccination
      const response = await fetch(`${API_BASE_URL}/api/vaccinationschedules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient: patientId,
          vaccine: selectedVaccine,
          time_slot: selectedTimeslot,
          dose_on_hold: doseOnHold,
        }),
      });

      if (response.ok) {
        console.log('Vaccination scheduled successfully');
        // Optionally, you can update the state or take additional actions
      } else {
        const errorData = await response.json();
        console.error('Failed to schedule vaccination:', errorData);
      }
    } catch (error) {
      console.error('Error scheduling vaccination:', error);
    }
  };

  useEffect(() => {
    const fetchScheduledTimes = async () => {
      try {
        // Fetch all vaccination schedules
        const response = await fetch(`${API_BASE_URL}/api/vaccinationschedules/`);
        if (response.ok) {
          const schedulesData = await response.json();

          // Filter schedules that match the patientId
          const patientSchedules = schedulesData.filter((schedule) => schedule.patient === patientId);
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
  }, [patientId]);

  useEffect(() => {
    const fetchVaccinationHistory = async () => {
      try {
        // Fetch all vaccination records
        const response = await fetch(`${API_BASE_URL}/api/vaccinationrecords/`);
        if (response.ok) {
          const recordsData = await response.json();

          // Filter records that match the patientId
          const patientRecords = recordsData.filter((record) => record.patient === patientId);

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
  }, [patientId]);

  const handleCancelScheduledTime = async () => {
    try {
      // Find the scheduling_id based on patient ID and selected time slot
      const matchingSchedule = scheduledTimes.find(
        (schedule) => schedule.time_slot === selectedScheduledTime
      );

      if (!matchingSchedule) {
        console.error('Matching schedule not found');
        return;
      }

      const schedulingIdToDelete = matchingSchedule.schedule_id;

      // Send a request to delete the scheduling record
      const deleteResponse = await fetch(`${API_BASE_URL}/api/vaccinationschedules/${schedulingIdToDelete}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (deleteResponse.ok) {
        console.log('Scheduled time canceled successfully');
        // Optionally, you can update the state or take additional actions
      } else {
        const errorData = await deleteResponse.json();
        console.error('Failed to cancel scheduled time:', errorData);
      }
    } catch (error) {
      console.error('Error canceling scheduled time:', error);
    }
  };

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
      <h2>Patient Page</h2>
      <p>Welcome, Patient {username}!</p>
      <h2>Patient Information</h2>
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
        <button type="button" onClick={handleUpdateInfo}>
          Update Information
        </button>
      </form>
      <h2>Schedule Vaccination</h2>
      <label>
        Select Time Slot:
        <select value={selectedTimeslot} onChange={(e) => setSelectedTimeslot(e.target.value)}>
          <option value="">Select a Timeslot</option>
          {timeslots.map((timeslot) => (
            <option key={timeslot.time_slot_id} value={timeslot.time_slot_id}>
              {timeslot.start_time}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Vaccine:
        <select value={selectedVaccine} onChange={(e) => setSelectedVaccine(e.target.value)}>
          <option value="">Select a Vaccine</option>
          {vaccines.map((vaccine) => (
            <option key={vaccine.vaccine_id} value={vaccine.vaccine_id}>
              {vaccine.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Dose on Hold:
        <input
          type="text"
          value={doseOnHold}
          onChange={(e) => setDoseOnHold(e.target.value)}
        />
      </label>
      <button type="button" onClick={handleScheduleVaccination}>
        Schedule Vaccination
      </button>
      <h2>Scheduled Times</h2>
      <label>
        Select Scheduled Time:
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

      <button type="button" onClick={handleCancelScheduledTime}>
        Cancel Scheduled Time
      </button>
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

export default PatientPage;
