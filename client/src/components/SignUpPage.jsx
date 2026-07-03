import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthForms.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const defaultRole = urlParams.get('role') || 'consumer';
  const [role, setRole] = useState(defaultRole);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
      });

      if (role === 'provider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/listings');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="consumer">Consumer</option>
            <option value="provider">Provider</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
