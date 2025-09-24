import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, error, loading } = useAuth();
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
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        alert('Login successful!');
        navigate('/');
      } else {
        alert(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        alert('Google sign-in successful!');
        navigate('/');
      } else {
        alert(result.error || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert(error.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="health-form-container">
      <div className="form-header">
        <h1>
          <FontAwesomeIcon icon={faSignInAlt} /> Login to ArogyaAI
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
            <button type="submit" className="btn btn-primary" disabled={isLoading || loading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div style={{ margin: '1rem 0', textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '1rem 0',
              color: '#6b7280'
            }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e7eb' }} />
            </div>
            
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading || loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isLoading || loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading || loading ? 0.6 : 1
              }}
              onMouseOver={(e) => {
                if (!isLoading && !loading) {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && !loading) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }
              }}
            >
              <FaGoogle style={{ color: '#ea4335' }} />
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>

          {error && (
            <div style={{ 
              color: '#dc2626', 
              textAlign: 'center', 
              marginTop: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fee2e2',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

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
