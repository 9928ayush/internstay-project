import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // or any CSS you have
import './components/LandingPage.css'; // or any CSS you have
import './components/ProviderRegistrationForm.css'; // or any CSS you have


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
