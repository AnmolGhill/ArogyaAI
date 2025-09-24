import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav-bar">
      {/* Left Side: HALO Logo and Title */}
      <div className="nav-brand">
        <h1>
          <FontAwesomeIcon icon={faHeartbeat} /> HALO
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

          {!user ? (
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
              {/* Logout button */}
              <button className="btn-primary" onClick={handleLogout}>
                Logout
              </button>

              {/* Profile icon */}
              <div className="profile-icon" title="Profile">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
