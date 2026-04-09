import React, { useState, useEffect } from 'react';

const BookingWizard = () => {
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLocationSelect = (e) => {
        setLocation(e.target.value);
        setStep(2);
    };

    const handleVehicleSelect = (e) => {
        setVehicle(e.target.value);
        setStep(3);
    };

    const handleServiceTypeSelect = (e) => {
        setServiceType(e.target.value);
        setStep(4);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location, vehicle, serviceType }),
            });
            if (!response.ok) {
                throw new Error('Booking failed');
            }
            alert('Booking confirmed!'); // Or redirect to a confirmation page
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {step === 1 && (
                <div>
                    <h2>Select Location</h2>
                    <select onChange={handleLocationSelect}>
                        <option value="">Select a location</option>
                        <option value="Location 1">Location 1</option>
                        <option value="Location 2">Location 2</option>
                    </select>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Select Vehicle</h2>
                    <select onChange={handleVehicleSelect}>
                        <option value="">Select a vehicle</option>
                        <option value="Vehicle 1">Vehicle 1</option>
                        <option value="Vehicle 2">Vehicle 2</option>
                    </select>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h2>Select Service Type</h2>
                    <select onChange={handleServiceTypeSelect}>
                        <option value="">Select a service</option>
                        <option value="Service 1">Service 1</option>
                        <option value="Service 2">Service 2</option>
                    </select>
                </div>
            )}
            {step === 4 && (
                <div>
                    <h2>Booking Confirmation</h2>
                    <p>Location: {location}</p>
                    <p>Vehicle: {vehicle}</p>
                    <p>Service Type: {serviceType}</p>
                    <button onClick={handleSubmit}>Confirm Booking</button>
                </div>
            )}
        </div>
    );
};

export default BookingWizard;