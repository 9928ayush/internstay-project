import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
// Reusing the CSS file we already updated to keep your project clean
import './ProviderRegistrationForm.css'; 

const AddTechPark = () => {
  // Simple state variables for the tech park form
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [comps, setComps] = useState(''); // Comma-separated companies

  // Handles pushing the new tech park to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !city) {
      alert('Name and city are required');
      return;
    }

    try {
      // Writes to the new 'techParks' collection instead of hospitals
      await addDoc(collection(db, 'techParks'), {
        name,
        city,
        // Converts the comma-separated string into a clean array
        companies: comps.split(',').map((c) => c.trim()),
      });
      
      alert('Tech Park added successfully!');
      
      // Clear form inputs after success
      setName('');
      setCity('');
      setComps('');
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to add tech park');
    }
  };

  return (
    // Reusing the wrapper and container classes from your updated CSS
    <div className="provider-form-wrapper">
      <div className="form-container">
        <h2>Add New Tech Park</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tech Park Name:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            City:
            <input value={city} onChange={(e) => setCity(e.target.value)} required />
          </label>
          <label>
            Major Companies (comma separated):
            <input value={comps} onChange={(e) => setComps(e.target.value)} />
          </label>
          <button type="submit">Add Tech Park</button>
        </form>
      </div>
    </div>
  );
};

export default AddTechPark;