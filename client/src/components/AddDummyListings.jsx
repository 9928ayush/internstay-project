import React, { useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddDummyListings = () => {
  // useEffect triggers the database seeding once when this component mounts
  useEffect(() => {
    // Array of seed data matching the new InternStay property schema
    const data = [
      {
        name: 'TechHaven Co-living',
        address: 'Phase 3, Gurugram',
        techParkNearby: 'DLF Cyber City',
        facilities: ['High-Speed WiFi', 'AC', 'Fully Furnished'],
        description: 'Plug-and-play coliving space just 5 mins from the office.',
      },
      {
        name: 'Zolo Tech Stay',
        address: 'BTM Layout, Bangalore',
        techParkNearby: 'Electronic City',
        facilities: ['High-Speed WiFi', 'Food/Mess Included', 'Laundry'],
        description: 'Vibrant community living with daily meals included.',
      },
      {
        name: 'HackerHouse PG',
        address: 'Wakad, Pune',
        techParkNearby: 'Hinjewadi IT Park',
        facilities: ['AC', 'Power Backup', 'Fully Furnished'],
        description: 'Spacious shared rooms with uninterrupted power backup.',
      },
      {
        name: 'CodeNest Apartments',
        address: 'Madhapur, Hyderabad',
        techParkNearby: 'Hitech City',
        facilities: ['High-Speed WiFi', 'Power Backup', 'Laundry'],
        description: 'Quiet, premium apartments walking distance from Hitech City.',
      },
    ];

    // Async function loops through the array and pushes each item to Firestore
    const seedDB = async () => {
      try {
        for (let item of data) {
          // Writes each item as a new document in the 'properties' collection
          await addDoc(collection(db, 'properties'), item);
        }
        alert('Dummy listings added!');
      } catch (err) {
        console.error('Error adding data:', err);
      }
    };

    // Execute the seed function
    seedDB();
  }, []);

  // Renders a temporary loading screen while the script runs
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Adding dummy listings...</h2>
      <p>This will only run once. Remove this route afterward.</p>
    </div>
  );
};

export default AddDummyListings;