import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import './BookNow.css';

const BookNow = () => {
  // Extract property ID from URL parameters
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  // Simplified state variables
  const [prop, setProp] = useState(null);
  const [user, setUser] = useState(null);
  
  // State for the booking payload
  const [form, setForm] = useState({
    name: '',
    company: '', // Replaced 'disease'
    needs: '',
    date: '',
    time: '',    // Replaced 'duration' (days -> months)
  });

  // Track active user session
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  // Fetch the specific property details on load
  useEffect(() => {
    const fetchProp = async () => {
      try {
        // Look up the document in Firestore by its ID
        const ref = doc(db, 'properties', propertyId);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          setProp({ id: snap.id, ...snap.data() });
        } else {
          alert('Property not found.');
          navigate('/listings');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchProp();
  }, [propertyId, navigate]);

  // Generic handler for all form inputs
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Process the booking request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to book a stay.');
      navigate('/login');
      return;
    }

    if (!prop?.providerId) {
      alert('Property data is missing provider ID.');
      return;
    }

    try {
      // Write the new booking to the 'bookings' collection
      await addDoc(collection(db, 'bookings'), {
        ...form,
        userId: user.uid,
        propertyId: prop.id,
        providerId: prop.providerId, // Critical: Links booking to the Host
        bookedAt: new Date(),
        status: 'pending',
      });

      alert('Booking request submitted!');
      navigate('/listings');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to book. Please try again.');
    }
  };

  return (
    <div className="booknow-page">
      <div className="booknow-card">
        <h2>Book a Stay</h2>

        {/* Display property details if loaded */}
        {prop ? (
          <div className="property-details">
            <h3>{prop.name}</h3>
            <p><strong>Address:</strong> {prop.address}</p>
            <p><strong>Near:</strong> {prop.techParkNearby}</p>
          </div>
        ) : (
          <p>Loading property...</p>
        )}

        {/* Form elements mapped to the simplified state */}
        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company / Role"
            value={form.company}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="needs"
            placeholder="Specific Needs (optional)"
            value={form.needs}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="time"
            placeholder="Duration (months)"
            value={form.time}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-booking">Submit Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookNow;