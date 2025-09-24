import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCalendar, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { apiService, handleApiError } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age)
      };

      const response = await apiService.auth.register(userData);
      
      if (response.data.success) {
        alert('Registration successful! Please login to continue.');
        navigate('/login');
      } else {
        alert(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorInfo = handleApiError(error);
      alert(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="health-form-container">
      <div className="form-header">
        <h1>
          <FontAwesomeIcon icon={faUserPlus} /> Register for HALO
        </h1>
        <p>Create your healthcare account</p>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="health-form">
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faUser} />
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faCalendar} />
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    value={formData.age}
                    onChange={handleInputChange}
                    required 
                    min="1"
                    max="120"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faLock} />
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    minLength="6"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon">
                  <FontAwesomeIcon icon={faLock} />
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                    minLength="6"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
