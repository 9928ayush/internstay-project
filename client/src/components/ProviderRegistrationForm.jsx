import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './ProviderRegistrationForm.css';

const ProviderRegistrationForm = () => {
  // Hook for programmatic routing
  const navigate = useNavigate();
  
  // Local state management for form inputs and user session
  const [currentUser, setCurrentUser] = useState(null);
  const [techParkList, setTechParkList] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [techParkNearby, setTechParkNearby] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [description, setDescription] = useState('');

  // Static list of amenities available for selection
  const allFacilities = ['High-Speed WiFi', 'AC', 'Fully Furnished', 'Food/Mess Included', 'Power Backup', 'Laundry'];

  // Effect hook to verify active user session on mount; redirects unauthenticated users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else navigate('/login');
    });
    // Cleanup subscription on component unmount to prevent memory leaks
    return () => unsubscribe();
  }, [navigate]);

  // Effect hook to asynchronously fetch tech park names for the dropdown
  useEffect(() => {
    const fetchTechParks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'techParks'));
        // Maps over Firestore documents to extract just the 'name' field
        const techParks = snapshot.docs.map(doc => doc.data().name);
        setTechParkList(techParks);
      } catch (err) {
        console.error('Error fetching tech parks:', err);
      }
    };
    fetchTechParks();
  }, []);

  // Utility to add/remove items from the facilities array immutably
  const handleFacilityToggle = (facility) => {
    setFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  // Handles form submission to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default browser page reload
    if (!currentUser) return;

    try {
      // Writes a new document to the 'properties' collection
      await addDoc(collection(db, 'properties'), {
        uid: currentUser.uid,
        name,
        contact,
        address,
        techParkNearby,
        facilities,
        description,
        createdAt: new Date(),
        providerId: currentUser.uid // Links the property to the specific host's ID
      });

      alert("Property submitted successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit property");
    }
  };

  return (
    <div className="provider-form-wrapper">
      <div className="form-container">
        <h2>Register Your Property</h2>
        <p>Provide accurate details to help interns find your place easily.</p>
        
        {/* Form triggers handleSubmit on submission */}
        <form onSubmit={handleSubmit}>
          
          {/* Controlled inputs bind their value to React state */}
          <label>Name:
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>Contact Info:
            <input type="text" required value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>

          <label>Address:
            <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>

          {/* Dynamic dropdown populated from Firestore fetch */}
          <label>Nearby Tech Park:
            <select
              required
              value={techParkNearby}
              onChange={(e) => setTechParkNearby(e.target.value)}
            >
              <option value="">Select a tech park</option>
              {techParkList.map((techPark, index) => (
                <option key={index} value={techPark}>{techPark}</option>
              ))}
            </select>
          </label>

          <label>Description:
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <label>Facilities:</label>
          <div className="facilities-grid">
            {allFacilities.map(facility => (
              <label key={facility} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={facilities.includes(facility)}
                  onChange={() => handleFacilityToggle(facility)}
                />
                {facility}
              </label>
            ))}
          </div>

          <button type="submit">Submit Property</button>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegistrationForm;