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
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Sidebar from '../components/Sidebar';
import GoogleMapWidget from '../components/GoogleMapWidget';
import ConnectionTest from '../components/ConnectionTest';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
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
                  <FontAwesomeIcon icon={faHeartbeat} /> {t('heroTitle')}
                </h2>
                
                {/* Google Map (responsive) */}
                <div style={{ margin: '0 auto', width: '100%', maxWidth: '720px' }}>
                  <GoogleMapWidget />
                </div>

                {/* Description */}
                <p>{t('heroDesc')}</p>
              </div>
            </div>
          </div>
        </div>
         
        {/* Your Health Overview */}
        <div className="health-info">
          <div className="health-header">
            <h2>
              <FontAwesomeIcon icon={faHeartbeat} /> {t('healthOverview')}
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
                  <h4>{t('weight')}</h4>
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
                  <h4>{t('height')}</h4>
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
                  <h4>{t('bloodType')}</h4>
                  <p className="stat-value">{healthData.bloodType}</p>
                  <div className="stat-info"></div>
                </div>
              </div>
            </div>

            {/* Recent Medical History section */}
            <div className="recent-medical-history-card">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faHistory} /> {t('recentHistory')}
              </h3>

              {/* Timeline container */}
              <div className="medical-history-timeline">
                {/* 1. Event: Last Checkup */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>{t('lastCheckup')}</h4>
                    <p>{t('regularCheckup')}</p>
                    <span className="event-date">2 {t('weeksAgo')}</span>
                  </div>
                </div>

                {/* 2. Event: Vaccination */}
                <div className="medical-history-event">
                  <div className="event-dot"></div>
                  <div className="event-details">
                    <h4>{t('vaccination')}</h4>
                    <p>{t('fluShot')}</p>
                    <span className="event-date">1 {t('monthAgo')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Metrics Chart */}
            <div className="health-metrics">
              {/* Section Heading */}
              <h3>
                <FontAwesomeIcon icon={faChartLine} /> {t('healthMetrics')}
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
                  <span className="metric-status">{t('normal')}</span>
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
              <FontAwesomeIcon icon={faRobot} /> {t('healthcareBot')}
            </h3>
            <p>
              {t('healthcareBotLongDesc')}
            </p>
          </div>
        
          {/* Medicine Recognition Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faPills} /> {t('medicineRecognition')}
            </h3>
            <p>
              {t('medicineRecognitionLongDesc')}
            </p>
          </div>
        
          {/* EQ Assessment Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faBrain} /> {t('eqAssessment')}
            </h3>
            <p>
              {t('eqAssessmentLongDesc')}
            </p>
          </div>

          {/* WhatsApp Services Description */}
          <div className="service-description">
            <h3>
              <FontAwesomeIcon icon={faWhatsapp} /> {t('whatsappServices')}
            </h3>
            <p>
              {t('whatsappServicesLongDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
