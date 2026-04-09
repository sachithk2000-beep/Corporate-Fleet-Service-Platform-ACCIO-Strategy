import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingWizard = () => {
  const [location, setLocation] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

  // Mock API call for locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      return response.data;
    } catch (err) {
      setError('Error fetching locations');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleNextStep = () => {
    if (step === 4) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const bookingData = { location, vehicle, serviceType };
      await axios.post('/api/bookings', bookingData);
      alert('Booking confirmed!');
    } catch (err) {
      setError('Error confirming booking');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {step === 1 && (
        <div>
          <h2>Select Location</h2>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location" />
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Select Vehicle</h2>
          <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="Enter vehicle type" />
          <button onClick={handlePrevStep}>Back</button>
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Select Service Type</h2>
          <input type="text" value={serviceType} onChange={e => setServiceType(e.target.value)} placeholder="Enter service type" />
          <button onClick={handlePrevStep}>Back</button>
          <button onClick={handleNextStep}>Next</button>
        </div>
      )}
      {step === 4 && (
        <div>
          <h2>Confirm Booking</h2>
          <p>Location: {location}</p>
          <p>Vehicle: {vehicle}</p>
          <p>Service Type: {serviceType}</p>
          <button onClick={handlePrevStep}>Back</button>
          <button onClick={handleNextStep}>Confirm Booking</button>
        </div>
      )}
    </div>
  );
};

export default BookingWizard;