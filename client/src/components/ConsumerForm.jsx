import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ConsumerForm.css';

const ConsumerForm = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const [fullName, setFullName] = useState('');
  const [diseaseType, setDiseaseType] = useState('');
  const [proximity, setProximity] = useState('');
  const [budget, setBudget] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else navigate('/login');
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'requests'), {
        uid: currentUser.uid,
        fullName,
        diseaseType,
        proximity,
        budget,
        specialNeeds,
        startDate,
        duration: Number(duration),
        createdAt: new Date()
      });

      alert("Accommodation request submitted!");
      navigate('/');
    } catch (error) {
      console.error("Error submitting request: ", error);
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="consumer-form-wrapper">
      <div className="form-card">
        <h2 className="form-title">Find a Stay</h2>
        <p className="form-subtext">Submit your needs and we’ll help you find suitable accommodations.</p>
        <form className="consumer-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </label>

          <label>
            Patient Disease Type
            <input type="text" value={diseaseType} onChange={(e) => setDiseaseType(e.target.value)} required />
          </label>

          <label>
            Required Proximity To
            <input type="text" value={proximity} onChange={(e) => setProximity(e.target.value)} required />
          </label>

          <label>
            Budget Range
            <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          </label>

          <label>
            Special Needs (optional)
            <textarea value={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.value)} />
          </label>

          <label>
            Required From
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>

          <label>
            Duration of Stay (days)
            <input type="number" min="1" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </label>

          <button type="submit">Request Stay</button>
        </form>
      </div>
    </div>
  );
};

export default ConsumerForm;
