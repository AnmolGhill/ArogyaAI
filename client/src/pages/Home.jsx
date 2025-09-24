import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartbeat, 
  faWeight, 
  faRulerVertical, 
  faTint, 
  faHistory, 
  faChartLine,
  faRobot,
  faPills,
  faBrain
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/Sidebar';
import ConnectionTest from '../components/ConnectionTest';

const Home = () => {
  const [healthData, setHealthData] = useState({
    weight: 'Loading...',
    height: 'Loading...',
    bloodType: 'Loading...'
  });

  useEffect(() => {
    // Load user health data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.userId) {
      // In a real app, you would fetch this from the API
      // For now, we'll use mock data
      setHealthData({
        weight: '70 kg',
        height: '175 cm',
        bloodType: 'O+'
      });
    }
  }, []);

  return (
    <div className="main-container">
      <Sidebar />

      <div className="content">
        {/* Connection Test */}
        <ConnectionTest />

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-banner">
            <div className="hero-content">
              <div className="hero-text">
                {/* Title */}
                <h2>
                  <FontAwesomeIcon icon={faHeartbeat} /> Healthcare AI Linked Operations
                </h2>
                
                {/* Animation placeholder - you can add Lottie later */}
                <div style={{ width: '260px', height: '200px', margin: '0 auto' }}>
                  <div style={{ 
                    background: 'linear-gradient(45deg, #4299E1, #2C5282)', 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem'
                  }}>
                    <FontAwesomeIcon icon={faHeartbeat} />
                  </div>
                </div>

                {/* Description */}
                <p>Experience AI-driven medical solutions at your fingertips.</p>
              </div>
            </div>
          </div>
        </div>
         
        {/* Your Health Overview */}
        <div className="health-info">
          <div className="health-header">
            <h2>
              <FontAwesomeIcon icon={faHeartbeat} /> Your Health Overview
            </h2>
            <div className="health-status"></div>
          </div>
          
          <div className="health-dashboard">
            {/* Main Health Status */}
            <div className="whb-container">
              {/* 1. Weight */}
              <div className="health-stat-card primary">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faWeight} />
                </div>
                <div className="stat-content">
                  <h4>Weight</h4>
                  <p className="stat-value">{healthData.weight}</p>
                  <div className="stat-trend positive"></div>
                </div>
              </div>

              {/* 2. Height */}
              <div className="health-stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faRulerVertical} />
                </div>
                <div className="stat-content">
                  <h4>Height</h4>
                  <p className="stat-value">{healthData.height}</p>
                  <div className="stat-trend neutral"></div>
                </div>
              </div>

              {/* 3. Blood Type */}
              <div className="health-stat-card">
                <div className="stat-icon">
                  <FontAwesomeIcon icon={faTint} />
                </div>
                <div className="stat-content">
                  <h4>Blood Type</h4>
                  <p className="stat-value">{healthData.bloodType}</p>
                  <div className="stat-info"></div>
                </div>
              </div>
            </div>

            {/* Recent Medical History section */}
            <div className="recent-medical-history-card">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faHistory} /> Recent Medical History
              </h3>

              {/* Timeline container */}
              <div className="medical-history-timeline">
                {/* 1. Event: Last Checkup */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>Last Checkup</h4>
                    <p>Regular health examination completed</p>
                    <span className="event-date">2 weeks ago</span>
                  </div>
                </div>

                {/* 2. Event: Vaccination */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>Vaccination</h4>
                    <p>Annual flu shot administered</p>
                    <span className="event-date">1 month ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics Chart */}
            <div className="health-metrics">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faChartLine} /> Health Metrics
              </h3>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <h4>BMI</h4>
                    <span className="metric-value">22.5</span>
                  </div>
                  <div className="metric-indicator">
                    <div className="indicator-bar" style={{ width: '75%' }}></div>
                  </div>
                  <span className="metric-status">Normal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Descriptions */}
        <div className="service-descriptions">
          {/* Healthcare Chatbot Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faRobot} /> Healthcare Chatbot
            </h3>
            <p>
              Our AI-powered chatbot provides instant medical guidance, symptom analysis, 
              and healthcare recommendations. Available 24/7, it offers reliable preliminary 
              medical advice while maintaining complete privacy.
            </p>
          </div>
        
          {/* Medicine Recognition Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faPills} /> Medicine Recognition
            </h3>
            <p>
              Advanced medicine identification system that helps you recognize medications, 
              understand their uses, proper dosage, and potential side effects. Simply upload 
              a photo of your medication for instant information.
            </p>
          </div>
        
          {/* EQ Assessment Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faBrain} /> EQ Assessment
            </h3>
            <p>
              Professional emotional intelligence evaluation tool that helps assess and improve 
              your emotional awareness, empathy, and social skills. Get personalized insights 
              and development recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
