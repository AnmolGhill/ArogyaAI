import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { apiService, handleApiError } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setIsLoading(true);

    try {
      const response = await apiService.auth.login(formData);
      
      if (response.data.success) {
        // Store user data and token
        const userData = {
          userId: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          token: response.data.access_token
        };

        localStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful!');
        navigate('/');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <FontAwesomeIcon icon={faSignInAlt} /> Login to HALO
        </h1>
        <p>Access your healthcare dashboard</p>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="health-form">
          <div className="form-section">
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
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
