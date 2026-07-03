import React, { useState } from 'react';
import { auth, provider, db } from '../firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userLog = await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully");

      const user = userLog.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        if (role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/listings');
        }
      } else {
        alert('User role not found.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Default to consumer if new user logs in with Google
        await setDoc(userRef, {
          email: user.email,
          role: 'consumer'
        });
        navigate('/listings');
      } else {
        const role = userSnap.data().role;
        if (role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/listings');
        }
      }

      alert("Google login successful");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleEmailLogin}>
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
          <button type="submit">Login</button>
        </form>

        <div className="auth-separator">or</div>

        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginPage;
