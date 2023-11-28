import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config';
import { Navigate, useParams } from 'react-router-dom';

const NursePage = () => {
    const [logout, setLogout] = useState(false);

    const { username } = useParams();

    const [nurseInfo, setNurseInfo] = useState({
      fname: '',
      mi: '',
      lname: '',
      employee_id: '',
      age: '',
      gender: '',
      phone_number: '',
      address: '',
      username: '',
      password: ''
    });
    const [nurseId, setNurseId] = useState(null);

    const [selectedStartTime, setSelectedStartTime] = useState(null);

    const [scheduledTimes, setScheduledTimes] = useState([]);
    const [selectedScheduledTime, setSelectedScheduledTime] = useState('');

    const [allNurseSchedules, setAllNurseSchedules] = useState([]);

    const [allPatients, setAllPatients] = useState([]);
    const [allVaccines, setAllVaccines] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [selectedDoseGiven, setSelectedDoseGiven] = useState('');
    const [selectedVaccinationTimeSlot, setSelectedVaccinationTimeSlot] = useState(null);
  
    useEffect(() => {
        const fetchNurses = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/nurses/`);
            if (response.ok) {
              const nurses = await response.json();
              const nurseWithUsername = nurses.find((nurse) => nurse.username === username);
    
              if (nurseWithUsername) {
                setNurseId(nurseWithUsername.nurse_id);
              } else {
                console.error('Nurse not found with username:', username);
              }
            } else {
              console.error('Failed to fetch nurses');
            }
          } catch (error) {
            console.error('Error fetching nurses:', error);
          }
        };
    
        fetchNurses();
      }, [username]);
    
      useEffect(() => {
        const fetchNurseInfo = async () => {
          try {
            if (nurseId) {
              const response = await fetch(`${API_BASE_URL}/api/nurses/${nurseId}/`);
              if (response.ok) {
                const nurseData = await response.json();
                setNurseInfo(nurseData);
              } else {
                console.error('Failed to fetch nurse information');
              }
            }
          } catch (error) {
            console.error('Error fetching nurse information:', error);
          }
        };
    
        fetchNurseInfo();
      }, [nurseId]);
    
  
      useEffect(() => {
        const fetchAllNurseSchedules = async () => {
          try {
            // Fetch all nurse schedules
            const response = await fetch(`${API_BASE_URL}/api/nurseschedulings/`);
            
            if (response.ok) {
              const allNurseSchedules = await response.json();
    
              // Filter nurse schedules based on nurse ID
              const nurseSchedules = allNurseSchedules.filter(
                scheduling => scheduling.nurse === nurseId
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
    
              setScheduledTimes(startTimesResponse);
            } else {
              console.error('Failed to fetch nurse scheduling:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching nurse scheduling:', error);
          }
        };
    
        fetchAllNurseSchedules();
      }, [nurseId]);

      useEffect(() => {
        const fetchNurseSchedules = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/nurseschedulings/`);
            if (response.ok) {
              const nurseSchedules = await response.json();
              setAllNurseSchedules(nurseSchedules);
            } else {
              console.error('Failed to fetch nurse schedules');
            }
          } catch (error) {
            console.error('Error fetching nurse schedules:', error);
          }
        };
    
        fetchNurseSchedules();
      }, [nurseId]);

      useEffect(() => {
        const fetchPatients = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/patients/`);
            if (response.ok) {
              const patients = await response.json();
              setAllPatients(patients);
            } else {
              console.error('Failed to fetch patients');
            }
          } catch (error) {
            console.error('Error fetching patients:', error);
          }
        };
    
        const fetchVaccines = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/vaccines/`);
            if (response.ok) {
              const vaccines = await response.json();
              setAllVaccines(vaccines);
            } else {
              console.error('Failed to fetch vaccines');
            }
          } catch (error) {
            console.error('Error fetching vaccines:', error);
          }
        };
    
        fetchPatients();
        fetchVaccines();
      }, []);

      const handleUpdateInfo = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/nurses/${nurseId}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phone_number: nurseInfo.phone_number,
              address: nurseInfo.address,
              fname: nurseInfo.fname,
              mi: nurseInfo.mi,
              lname: nurseInfo.lname,
              employee_id: nurseInfo.employee_id,
              age: nurseInfo.age,
              gender: nurseInfo.gender,
              username: nurseInfo.username,
              password: nurseInfo.password, 
            }),
          });
      
          if (response.ok) {
            console.log('Nurse information updated successfully');
          } else {
            const errorData = await response.json();
            console.error('Failed to update nurse information:', errorData);
          }
        } catch (error) {
          console.error('Error updating nurse information:', error);
        }
      };            
  
    const handleInputChange = (e) => {
      setNurseInfo({
        ...nurseInfo,
        [e.target.name]: e.target.value,
      });
    };

    const handleScheduleTimeSlot = async () => {
        try {
          // Calculate end time, assuming 1 hour duration
          const endTime = new Date(selectedStartTime);
          endTime.setHours(endTime.getHours() + 1);
      
          // Fetch all time slots
          const allTimeSlotsResponse = await fetch(`${API_BASE_URL}/api/timeslots/`);
      
          if (allTimeSlotsResponse.ok) {
            const allTimeSlots = await allTimeSlotsResponse.json();
      
            // Check if the selected time slot already exists
            const existingTimeSlot = allTimeSlots.find(
                (timeSlot) => new Date(timeSlot.start_time).toISOString() === new Date(selectedStartTime).toISOString()
              );
      
            if (existingTimeSlot) {
              // Time slot exists, use the existing one
              console.log('Using existing time slot:', existingTimeSlot);
              const timeSlotId = existingTimeSlot.time_slot_id;
      
              await createNurseScheduling(timeSlotId);
            } else {
              // Time slot doesn't exist, create a new one
              const newTimeSlotResponse = await fetch(`${API_BASE_URL}/api/timeslots/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  start_time: selectedStartTime,
                  end_time: endTime.toISOString(), // Convert end time to ISO format
                }),
              });
      
              if (newTimeSlotResponse.ok) {
                const newTimeSlot = await newTimeSlotResponse.json();
                console.log('New time slot created:', newTimeSlot);
                const timeSlotId = newTimeSlot.time_slot_id;
      
                // Use timeSlotId to create nurse scheduling
                await createNurseScheduling(timeSlotId);
              } else {
                const errorData = await newTimeSlotResponse.json();
                console.error('Failed to create new time slot:', errorData);
                return;
              }
            }
          } else {
            const errorData = await allTimeSlotsResponse.json();
            console.error('Failed to fetch all time slots:', errorData);
          }
        } catch (error) {
          console.error('Error scheduling time slot:', error);
        }
      };
      
      const createNurseScheduling = async (timeSlotID) => {
        try {
          // Fetch the nurse scheduling endpoint
          const response = await fetch(`${API_BASE_URL}/api/nurseschedulings/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nurse: nurseId,
              time_slot: timeSlotID,
            }),
          });
      
          if (response.ok) {
            console.log('Nurse scheduling created successfully');
            // Handle any additional actions after creating nurse scheduling if needed
          } else {
            const errorData = await response.json();
            console.error('Failed to create nurse scheduling:', errorData);
          }
        } catch (error) {
          console.error('Error creating nurse scheduling:', error);
        }
      };

      const findTimeSlotId = (selectedTime) => {
        const selectedTimeSlot = scheduledTimes.find(time => new Date(time).toLocaleString() === selectedTime);
        if (selectedTimeSlot) {
          // Use the found time slot to get the ID
          const timeSlotId = selectedTimeSlot.time_slot_id;
          return timeSlotId;
        }
        return 1; // Handle the case when the time slot is not found
      };
      
      const handleCancelScheduledTime = async () => {
        try {
          // Find the scheduling_id based on nurse ID and selected time slot
          const selectedTimeSlotId = findTimeSlotId(selectedScheduledTime);
          const matchingSchedule = allNurseSchedules.find(
            (schedule) => schedule.nurse === nurseId && schedule.time_slot === selectedTimeSlotId
          );
      
          if (!matchingSchedule) {
            console.error('Matching schedule not found');
            return;
          }
      
          const schedulingIdToDelete = matchingSchedule.scheduling_id;
      
          // Send a request to delete the scheduling record
          const deleteResponse = await fetch(`${API_BASE_URL}/api/nurseschedulings/${schedulingIdToDelete}/`, {
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
      
      const handleRecordVaccination = async () => {
        try {
          // Fetch the time slot ID based on the selected time slot
          const selectedTimeSlotId = findTimeSlotId(selectedVaccinationTimeSlot);
    
          // Send a request to record the vaccination
          const response = await fetch(`${API_BASE_URL}/api/vaccinationrecords/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient: selectedPatient,
              nurse: nurseId,
              vaccine: selectedVaccine,
              dose_given: selectedDoseGiven,
              time_slot: selectedTimeSlotId,
            }),
          });
    
          if (response.ok) {
            console.log('Vaccination recorded successfully');
            // Optionally, you can update the state or take additional actions
          } else {
            const errorData = await response.json();
            console.error('Failed to record vaccination:', errorData);
          }
        } catch (error) {
          console.error('Error recording vaccination:', error);
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
        <h2>Nurse Page</h2>
        <p>Welcome, Nurse {username}!</p>
        <h2>Nurse Information</h2>
        <form>
          <label>
            First Name:
            <input type="text" name="fname" value={nurseInfo.fname} readOnly />
          </label>
          <label>
            Middle Initial:
            <input type="text" name="mi" value={nurseInfo.mi} readOnly />
          </label>
          <label>
            Last Name:
            <input type="text" name="lname" value={nurseInfo.lname} readOnly />
          </label>
          <label>
            Employee ID:
            <input type="text" name="employee_id" value={nurseInfo.employee_id} readOnly />
          </label>
          <label>
            Age:
            <input type="text" name="age" value={nurseInfo.age} readOnly />
          </label>
          <label>
            Gender:
            <input type="text" name="gender" value={nurseInfo.gender} readOnly />
          </label>
          <label>
            Phone Number:
            <input type="text" name="phone_number" value={nurseInfo.phone_number} onChange={handleInputChange} />
          </label>
          <label>
            Address:
            <input type="text" name="address" value={nurseInfo.address} onChange={handleInputChange} />
          </label>
  
          <button type="button" onClick={handleUpdateInfo}>
            Update Information
          </button>
        </form>
        <h2>Schedule Time Slot</h2>
        <label>
            Select Time Slot:
            <input
                type="datetime-local"
                name="timeSlot"
                value={selectedStartTime || ''}
                onChange={(e) => setSelectedStartTime(e.target.value)}
            />
        </label>

        <button type="button" onClick={handleScheduleTimeSlot}>
            Schedule Time Slot
        </button>
        <h2>View and Cancel Scheduled Times</h2>
        <label>
            Select Scheduled Time:
            <select
            value={selectedScheduledTime}
            onChange={(e) => setSelectedScheduledTime(e.target.value)}
            >
            <option value="">Select...</option>
            {scheduledTimes.map((time, index) => (
                <option key={index} value={time}>
                {new Date(time).toLocaleString()}
                </option>
            ))}
            </select>
        </label>
        <button type="button" onClick={handleCancelScheduledTime}>
            Cancel Scheduled Time
        </button>
        <h2>Record Vaccination</h2>
        <label>
            Select Patient:
            <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
            <option value={null}>Select Patient</option>
            {allPatients.map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                {`${patient.fname} ${patient.lname}`}
                </option>
            ))}
            </select>
        </label>

        <label>
            Select Vaccine:
            <select value={selectedVaccine} onChange={(e) => setSelectedVaccine(e.target.value)}>
            <option value={null}>Select Vaccine</option>
            {allVaccines.map((vaccine) => (
                <option key={vaccine.vaccine_id} value={vaccine.vaccine_id}>
                {vaccine.name}
                </option>
            ))}
            </select>
        </label>

        <label>
            Dose Given:
            <input
            type="text"
            value={selectedDoseGiven}
            onChange={(e) => setSelectedDoseGiven(e.target.value)}
            />
        </label>

        <label>
            Select Vaccination Time Slot:
            <select
            value={selectedVaccinationTimeSlot}
            onChange={(e) => setSelectedVaccinationTimeSlot(e.target.value)}
            >
            <option value={null}>Select Time Slot</option>
            {scheduledTimes.map((time, index) => (
                <option key={index} value={time}>
                {new Date(time).toLocaleString()}
                </option>
            ))}
            </select>
        </label>

        <button type="button" onClick={handleRecordVaccination}>
            Record Vaccination
        </button>
      </div>
    );
  };
  
  export default NursePage;