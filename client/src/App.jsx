import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Health from './pages/Health';
import Chatbot from './pages/Chatbot';
import Doctor from './pages/Doctor';
import Medicine from './pages/Medicine';
import EQTest from './pages/EQTest';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import './styles/global.css';
import './styles/health.css';
import './styles/chatbot.css';

// Toast component for notifications
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  
  return (
    <div className={`toast ${type}`} style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/health" element={<Health />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/eqtest" element={<EQTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
