import React from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { hospitals } from './hospitalsData';

const UploadHospitals = () => {
  const upload = async () => {
    try {
      for (const hospital of hospitals) {
        await addDoc(collection(db, 'hospitals'), hospital);
        console.log(`Uploaded: ${hospital.name}`);
      }
      alert('All hospitals uploaded!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload some hospitals.');
    }
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Upload Hospital Data</h2>
      <button onClick={upload}>Upload to Firestore</button>
    </div>
  );
};

export default UploadHospitals;
