import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userProfile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav-bar">
      {/* Left Side: ArogyaAI Logo and Title */}
      <div className="nav-brand">
        <h1>
          <FontAwesomeIcon icon={faHeartbeat} /> ArogyaAI
        </h1>
      </div>

      {/* Right Side: Navigation Buttons */}
      <div className="nav-right">
        {/* Mobile menu icon */}
        <div className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </div>

        {/* Buttons */}
        <div className={`nav-buttons ${isMenuOpen ? 'active' : ''}`}>
          {/* About button */}
          <Link to="/about" className="btn-primary">
            About
          </Link>

          {!currentUser ? (
            <>
              {/* Login button */}
              <Link to="/login" className="btn-primary">
                Login
              </Link>

              {/* Register button */}
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          ) : (
            <>
              {/* User name display */}
              {userProfile && (
                <span className="user-greeting" style={{ 
                  color: '#10b981', 
                  fontWeight: '500',
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faUser} />
                  {userProfile.name || currentUser.displayName || 'User'}
                </span>
              )}

              {/* Logout button */}
              <button 
                className="btn-primary" 
                onClick={handleLogout}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                {loading ? 'Signing out...' : 'Logout'}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
