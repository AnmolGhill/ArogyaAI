import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUserMd, faPills, faBrain } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-services">
        
        {/* 1. Healthcare Chatbot */}
        <Link to="/chatbot" className="service-btn chatbot-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faRobot} />
          </span>
          <div className="service-content">
            <h3>Healthcare Chatbot</h3>
            <p>24/7 AI-powered medical assistance</p>
          </div>
        </Link>

        {/* 2. Doctor Preference (Online) */}
        <Link to="/doctor" className="service-btn doctor-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faUserMd} />
          </span>
          <div className="service-content">
            <h3>Doctor Preference (Online)</h3>
            <p>Select your preferred online doctor</p>
          </div>
        </Link>

        {/* 3. Medicine Recognition */}
        <Link to="/medicine" className="service-btn medicine-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faPills} />
          </span>
          <div className="service-content">
            <h3>Medicine Recognition</h3>
            <p>Identify medications instantly</p>
          </div>
        </Link>

        {/* 4. EQ Assessment */}
        <Link to="/eqtest" className="service-btn eq-btn">
          <span className="icon">
            <FontAwesomeIcon icon={faBrain} />
          </span>
          <div className="service-content">
            <h3>EQ Assessment</h3>
            <p>Evaluate emotional intelligence</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Sidebar;
