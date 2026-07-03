import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProviderPrompt, setShowProviderPrompt] = useState(false);

  // Check auth state and fetch the user's role (provider vs consumer)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      alert('Logged out successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to logout');
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/listings?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Ensure only Hosts (providers) can access the property registration flow
  const handleRegisterClick = async () => {
    if (!auth.currentUser) {
      setShowProviderPrompt(true); 
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'provider') {
        navigate('/register-provider');
      } else {
        alert('Only Host accounts can register properties.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying user role.');
    }
  };

  return (
    <div className="page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="container navbar-content">
          <div className="logo" onClick={() => navigate('/')}>InternStay</div>

          <div className="nav-search">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search tech parks or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button
                onClick={handleSearch}
                className="search-icon-btn"
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <>
                {userRole === 'provider' && (
                  <button
                    className="nav-link"
                    onClick={() => navigate('/provider-dashboard')}
                  >
                    Dashboard
                  </button>
                )}
                {userRole === 'consumer' && (
                  <button onClick={() => navigate('/my-bookings')} className="nav-link">My Bookings</button> 
                )}

                <button className="nav-link" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="signup-btn">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        <div className="container">
          <h1>Welcome to <span className="highlight">InternStay</span></h1>
          <p>Find verified, move-in ready accommodations near top tech parks tailored for incoming interns.</p>
          <div className="hero-buttons">
            <button onClick={handleRegisterClick} className="primary-btn">
              Host an Intern
            </button>
            <button onClick={() => navigate('/listings')} className="secondary-btn">
              Find a Stay
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section">
        <div className="container">
          <h2>Why Choose InternStay?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🏢 Tech Park Proximity</h3>
              <p>Stays within walking distance of major IT hubs to skip the commute.</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Plug & Play Living</h3>
              <p>High-speed WiFi, AC, and power backup so you can focus on work.</p>
            </div>
            <div className="feature-card">
              <h3>🤝 Community of Peers</h3>
              <p>Verified listings shared with like-minded young professionals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} InternStay — Your home near the office.
        </div>
      </footer>

      {/* MODAL */}
      {showProviderPrompt && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Register as a Host</h3>
            <p>You need to login or sign up as a Host to list a property.</p>
            <div className="modal-buttons">
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/signup?role=provider')}>Sign Up</button>
              <button onClick={() => setShowProviderPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;