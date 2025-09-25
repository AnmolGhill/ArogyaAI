import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { profileService } from '../services/firebase';
import { apiService } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faCalendar, faEdit, faPhone, faMapMarkerAlt,
  faBirthdayCake, faVenusMars, faTint, faWeight, faRuler, faHeartbeat,
  faShieldAlt, faHistory, faCog, faSignOutAlt, faBell, faEye, faLock,
  faChartLine, faAward, faCamera, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

const Profile = () => {
  const { currentUser, userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Create mock user for development if no current user
  const effectiveUser = currentUser || {
    uid: 'dev_user_123',
    email: 'dev@arogyaai.com',
    displayName: 'Development User',
    photoURL: null,
    metadata: {
      creationTime: new Date().toISOString()
    }
  };

  // Show login prompt only if explicitly requested (not in development)
  if (!currentUser && import.meta.env.PROD) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="not-logged-in">
            <FontAwesomeIcon icon={faUser} className="login-icon" />
            <h2>Please log in to view your profile</h2>
            <p>Access your personal health dashboard by signing in</p>
          </div>
        </div>
      </div>
    );
  }

  // Load user data from server (with Firebase fallback)
  useEffect(() => {
    const loadUserData = async () => {
      if (!effectiveUser) return;
      
      setLoading(true);
      try {
        // Try server API first
        try {
          // Use effectiveUser.uid for both real and development users
          const userId = effectiveUser.uid;
          console.log('🔍 Loading profile for user:', userId);
          
          const serverResult = await apiService.profile.getCompleteProfile(userId);
          if (serverResult.data && serverResult.data.success) {
            const data = serverResult.data.data;
            setProfileData(data.profile || {});
            setHealthData(data.health || {});
            setActivities(data.activities || []);
            setSettings(data.settings || {});
            
            // Initialize edit form with server data
            setEditForm({
              name: data.profile?.name || effectiveUser.displayName || '',
              age: data.profile?.age || '',
              gender: data.profile?.gender || '',
              phone: data.profile?.phone || '',
              location: data.profile?.location || '',
              emergencyContact: data.profile?.emergencyContact || '',
              height: data.health?.height || '',
              weight: data.health?.weight || '',
              bloodType: data.health?.bloodType || '',
              allergies: data.health?.allergies || [],
              medications: data.health?.medications || []
            });
            
            console.log('✅ Profile data loaded from server');
            return;
          }
        } catch (serverError) {
          console.warn('Server API error:', serverError.response?.data || serverError.message);
          console.log('🔄 Falling back to Firebase...');
        }
        
        // Fallback to Firebase (only if Firebase is configured)
        if (currentUser) {
          try {
            const result = await profileService.getUserProfile(currentUser.uid);
            if (result.success) {
              setProfileData(result.data.profile);
              setHealthData(result.data.health);
              setActivities(result.data.activities);
              setSettings(result.data.settings);
              
              // Initialize edit form with Firebase data
              setEditForm({
                name: result.data.profile?.name || effectiveUser.displayName || '',
                age: result.data.profile?.age || '',
                gender: result.data.profile?.gender || '',
                phone: result.data.profile?.phone || '',
                location: result.data.profile?.location || '',
                emergencyContact: result.data.profile?.emergencyContact || '',
                height: result.data.health?.height || '',
                weight: result.data.health?.weight || '',
                bloodType: result.data.health?.bloodType || '',
                allergies: result.data.health?.allergies || [],
                medications: result.data.health?.medications || []
              });
              
              console.log('✅ Profile data loaded from Firebase');
            } else {
              console.warn('Firebase fallback failed, using default data');
              initializeDefaultData();
            }
          } catch (firebaseError) {
            console.warn('Firebase not available, using default data');
            initializeDefaultData();
          }
        } else {
          // No Firebase user, use default data for development
          console.log('🔧 Development mode: using default data');
          initializeDefaultData();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        initializeDefaultData();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [effectiveUser]);

  const initializeDefaultData = () => {
    const defaultProfile = {
      name: effectiveUser?.displayName || 'User',
      email: effectiveUser?.email || '',
      photoURL: effectiveUser?.photoURL || null,
      createdAt: effectiveUser?.metadata?.creationTime
    };
    
    const defaultHealth = {
      height: "5'8\"",
      weight: '70 kg',
      bmi: '22.5',
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      bloodType: 'O+'
    };

    const defaultActivities = [
      {
        id: 1,
        type: 'health_assessment',
        title: 'Health Assessment Completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        type: 'consultation',
        title: 'Doctor Consultation Booked',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 3,
        type: 'test',
        title: 'EQ Test Completed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    const defaultSettings = {
      notifications: {
        healthReminders: true,
        appointmentAlerts: true,
        medicationReminders: false
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false
      }
    };

    setProfileData(defaultProfile);
    setHealthData(defaultHealth);
    setActivities(defaultActivities);
    setSettings(defaultSettings);
    
    setEditForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      location: '',
      emergencyContact: '',
      height: '',
      weight: '',
      bloodType: '',
      allergies: [],
      medications: []
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleSaveProfile = async () => {
    if (!effectiveUser) return;
    
    setLoading(true);
    try {
      // Prepare profile update data
      const profileUpdate = {
        name: editForm.name,
        age: editForm.age,
        gender: editForm.gender,
        phone: editForm.phone,
        location: editForm.location,
        emergencyContact: editForm.emergencyContact,
        email: effectiveUser.email
      };

      // Prepare health update data
      const healthUpdate = {
        height: editForm.height,
        weight: editForm.weight,
        bloodType: editForm.bloodType,
        allergies: editForm.allergies,
        medications: editForm.medications,
        bmi: calculateBMI(editForm.height, editForm.weight),
        bloodPressure: healthData?.bloodPressure || '120/80',
        heartRate: healthData?.heartRate || '72 bpm'
      };

      let profileResult, healthResult;

      // Try server API first
      try {
        const userId = effectiveUser.uid;
        console.log('💾 Saving profile for user:', userId);
        
        const serverProfileResult = await apiService.profile.updatePersonalInfo(userId, profileUpdate);
        const serverHealthResult = await apiService.profile.updateHealthProfile(userId, healthUpdate);
        
        if (serverProfileResult.data?.success && serverHealthResult.data?.success) {
          // Reload data from server
          const reloadResult = await apiService.profile.getCompleteProfile(userId);
          if (reloadResult.data?.success) {
            const data = reloadResult.data.data;
            setProfileData(data.profile);
            setHealthData(data.health);
          }
          
          setIsEditing(false);
          alert('Profile updated successfully via server!');
          
          // Add activity record
          try {
            await apiService.profile.addActivity(currentUser.uid, {
              type: 'profile_update',
              title: 'Profile Information Updated',
              description: 'Personal and health information updated'
            });
          } catch (activityError) {
            console.warn('Failed to add activity record:', activityError);
          }
          
          return;
        }
      } catch (serverError) {
        console.warn('Server update failed, falling back to Firebase:', serverError.message);
      }

      // Fallback to Firebase (only if real user exists)
      if (currentUser) {
        try {
          profileResult = await profileService.saveUserProfile(currentUser.uid, profileUpdate);
          healthResult = await profileService.updateHealthProfile(currentUser.uid, healthUpdate);

          if (profileResult.success && healthResult.success) {
            // Reload data from Firebase
            const result = await profileService.getUserProfile(currentUser.uid);
            if (result.success) {
              setProfileData(result.data.profile);
              setHealthData(result.data.health);
            }
            
            setIsEditing(false);
            alert('Profile updated successfully via Firebase!');
            
            // Add activity record to Firebase
            try {
              await profileService.addActivity(currentUser.uid, {
                type: 'profile_update',
                title: 'Profile Information Updated',
                description: 'Personal and health information updated'
              });
            } catch (activityError) {
              console.warn('Failed to add activity record:', activityError);
            }
          } else {
            alert('Failed to update profile. Please try again.');
          }
        } catch (firebaseError) {
          console.warn('Firebase save failed:', firebaseError);
          // In development mode, just update local state
          setProfileData({...profileData, ...profileUpdate});
          setHealthData({...healthData, ...healthUpdate});
          setIsEditing(false);
          alert('Profile updated successfully (development mode)!');
        }
      } else {
        // Development mode - just update local state
        setProfileData({...profileData, ...profileUpdate});
        setHealthData({...healthData, ...healthUpdate});
        setIsEditing(false);
        alert('Profile updated successfully (development mode)!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (category, setting, value) => {
    if (!currentUser) return;

    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };

    setSettings(updatedSettings);

    try {
      // Try server API first
      try {
        await apiService.profile.updateSettings(currentUser.uid, updatedSettings);
        console.log('✅ Settings updated via server');
      } catch (serverError) {
        console.warn('Server settings update failed, using Firebase:', serverError.message);
        await profileService.updateSettings(currentUser.uid, updatedSettings);
        console.log('✅ Settings updated via Firebase');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    try {
      setLoading(true);
      
      // Try server API first
      try {
        const serverResult = await apiService.profile.uploadProfilePicture(currentUser.uid, file);
        if (serverResult.data?.success) {
          // Update profile data with new photo URL
          setProfileData(prev => ({
            ...prev,
            photoURL: serverResult.data.photoURL
          }));
          alert('Profile picture updated successfully via server!');
          return;
        }
      } catch (serverError) {
        console.warn('Server upload failed, using Firebase:', serverError.message);
      }

      // Fallback to Firebase
      const result = await profileService.uploadProfilePicture(currentUser.uid, file);
      if (result.success) {
        // Update profile data with new photo URL
        setProfileData(prev => ({
          ...prev,
          photoURL: result.url
        }));
        alert('Profile picture updated successfully via Firebase!');
      } else {
        alert('Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (height, weight) => {
    // Simple BMI calculation (this is a basic implementation)
    if (!height || !weight) return '';
    
    const heightInM = parseFloat(height.replace(/[^\d.]/g, '')) * 0.3048; // Convert feet to meters
    const weightInKg = parseFloat(weight.replace(/[^\d.]/g, ''));
    if (heightInM && weightInKg && heightInM > 0 && weightInKg > 0) {
      return (weightInKg / (heightInM * heightInM)).toFixed(1);
    }
    return '';
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  const mockHealthData = {
    height: '5\'8"',
    weight: '70 kg',
    bmi: '22.5',
    bloodPressure: '120/80',
    heartRate: '72 bpm',
    lastCheckup: '2 weeks ago',
    allergies: ['Peanuts', 'Dust'],
    medications: ['Vitamin D', 'Omega-3'],
    emergencyContact: '+91 98765 43210'
  };

  const mockActivityData = {
    consultations: 12,
    testsCompleted: 8,
    appointmentsBooked: 15,
    healthScore: 85
  };

  return (
    <div className="profile-container">
      <div className="profile-layout">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-cover">
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {(profileData?.photoURL || effectiveUser.photoURL) ? (
                  <img 
                    src={profileData?.photoURL || effectiveUser.photoURL} 
                    alt="Profile" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <FontAwesomeIcon 
                  icon={faUser} 
                  style={{ 
                    display: (profileData?.photoURL || effectiveUser.photoURL) ? 'none' : 'flex',
                    fontSize: '3rem',
                    color: '#667eea'
                  }} 
                />
                <label className="avatar-edit-btn" htmlFor="profile-picture-upload">
                  <FontAwesomeIcon icon={faCamera} />
                  <input 
                    id="profile-picture-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">
              {profileData?.name || effectiveUser.displayName || 'User'}
            </h1>
            <p className="profile-email">
              <FontAwesomeIcon icon={faEnvelope} />
              {effectiveUser.email}
            </p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{activities.filter(a => a.type === 'consultation').length || 12}</span>
                <span className="stat-label">Consultations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{healthData?.healthScore || 85}%</span>
                <span className="stat-label">Health Score</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{activities.filter(a => a.type === 'test').length || 8}</span>
                <span className="stat-label">Tests Done</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className={`action-btn ${isEditing ? 'editing' : ''}`}
              onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              disabled={loading}
            >
              <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
              {loading ? 'Saving...' : (isEditing ? 'Save' : 'Edit Profile')}
            </button>
            <button className="action-btn logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FontAwesomeIcon icon={faUser} />
            Personal Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <FontAwesomeIcon icon={faHeartbeat} />
            Health Data
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <FontAwesomeIcon icon={faChartLine} />
            Activity
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FontAwesomeIcon icon={faCog} />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'personal' && (
            <div className="tab-content">
              <div className="info-grid">
                <div className="info-card">
                  <h3><FontAwesomeIcon icon={faUser} /> Basic Information</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>Member since: {new Date(effectiveUser.metadata?.creationTime || Date.now()).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Editable Name Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUser} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="Full Name"
                          className="edit-input"
                        />
                      ) : (
                        <span>Name: {profileData?.name || editForm.name || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Age Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faBirthdayCake} />
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                          placeholder="Age"
                          min="18"
                          max="100"
                          className="edit-input"
                        />
                      ) : (
                        <span>Age: {profileData?.age || editForm.age || ''} {(profileData?.age || editForm.age) ? 'years' : ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Gender Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faVenusMars} />
                      {isEditing ? (
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                          className="edit-input"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <span>Gender: {profileData?.gender || editForm.gender || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Phone Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faPhone} />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          placeholder="Phone Number"
                          className="edit-input"
                        />
                      ) : (
                        <span>Phone: {profileData?.phone || editForm.phone || ''}</span>
                      )}
                    </div>
                    
                    {/* Editable Location Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          placeholder="Location"
                          className="edit-input"
                        />
                      ) : (
                        <span>Location: {profileData?.location || editForm.location || ''}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3><FontAwesomeIcon icon={faShieldAlt} /> Emergency Contact</h3>
                  <div className="info-items">
                    {/* Editable Emergency Contact Field */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faUser} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.emergencyContact}
                          onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                          placeholder="Emergency Contact Name"
                          className="edit-input"
                        />
                      ) : (
                        <span>Contact: {profileData?.emergencyContact || editForm.emergencyContact || ''}</span>
                      )}
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>Phone: {profileData?.emergencyPhone || ''}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>Location: {profileData?.emergencyLocation || ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="tab-content">
              <div className="health-grid">
                <div className="health-card">
                  <h3><FontAwesomeIcon icon={faRuler} /> Physical Stats</h3>
                  <div className="health-stats">
                    {/* Editable Height */}
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faRuler} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.height}
                          onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                          placeholder="Height (e.g., 5'8'')"
                          className="edit-input stat-input"
                        />
                      ) : (
                        <span className="stat-value">{healthData?.height || editForm.height || ''}</span>
                      )}
                      <span className="stat-label">Height</span>
                    </div>
                    
                    {/* Editable Weight */}
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faWeight} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.weight}
                          onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                          placeholder="Weight (e.g., 70 kg)"
                          className="edit-input stat-input"
                        />
                      ) : (
                        <span className="stat-value">{healthData?.weight || editForm.weight || ''}</span>
                      )}
                      <span className="stat-label">Weight</span>
                    </div>
                    
                    {/* BMI (calculated) */}
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faChartLine} />
                      <span className="stat-value">{healthData?.bmi || calculateBMI(editForm.height, editForm.weight)}</span>
                      <span className="stat-label">BMI</span>
                    </div>
                  </div>
                </div>

                <div className="health-card">
                  <h3><FontAwesomeIcon icon={faHeartbeat} /> Vital Signs & Blood Type</h3>
                  <div className="health-stats">
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faHeartbeat} />
                      <span className="stat-value">{healthData?.heartRate || ''}</span>
                      <span className="stat-label">Heart Rate</span>
                    </div>
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faTint} />
                      <span className="stat-value">{healthData?.bloodPressure || ''}</span>
                      <span className="stat-label">Blood Pressure</span>
                    </div>
                    
                    {/* Editable Blood Type */}
                    <div className="stat-box">
                      <FontAwesomeIcon icon={faTint} />
                      {isEditing ? (
                        <select
                          value={editForm.bloodType}
                          onChange={(e) => setEditForm({...editForm, bloodType: e.target.value})}
                          className="edit-input stat-input"
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      ) : (
                        <span className="stat-value">{healthData?.bloodType || editForm.bloodType || ''}</span>
                      )}
                      <span className="stat-label">Blood Type</span>
                    </div>
                  </div>
                </div>

                {/* Editable Allergies and Medications */}
                <div className="health-card full-width">
                  <h3><FontAwesomeIcon icon={faHistory} /> Medical Information</h3>
                  <div className="medical-info">
                    <div className="medical-section">
                      <h4>Allergies</h4>
                      {isEditing ? (
                        <textarea
                          value={Array.isArray(editForm.allergies) ? editForm.allergies.join(', ') : editForm.allergies}
                          onChange={(e) => setEditForm({...editForm, allergies: e.target.value.split(', ').filter(a => a.trim())})}
                          placeholder="Enter allergies separated by commas"
                          className="edit-textarea"
                          rows="2"
                        />
                      ) : (
                        <p>{Array.isArray(healthData?.allergies) ? healthData.allergies.join(', ') : 
                             Array.isArray(editForm.allergies) ? editForm.allergies.join(', ') : ''}</p>
                      )}
                    </div>
                    
                    <div className="medical-section">
                      <h4>Current Medications</h4>
                      {isEditing ? (
                        <textarea
                          value={Array.isArray(editForm.medications) ? editForm.medications.join(', ') : editForm.medications}
                          onChange={(e) => setEditForm({...editForm, medications: e.target.value.split(', ').filter(m => m.trim())})}
                          placeholder="Enter medications separated by commas"
                          className="edit-textarea"
                          rows="2"
                        />
                      ) : (
                        <p>{Array.isArray(healthData?.medications) ? healthData.medications.join(', ') : 
                             Array.isArray(editForm.medications) ? editForm.medications.join(', ') : ''}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="health-card full-width">
                  <h3><FontAwesomeIcon icon={faHistory} /> Medical History</h3>
                  <div className="medical-timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>Regular Checkup</h4>
                        <p>Complete health examination - All normal</p>
                        <span className="timeline-date">{mockHealthData.lastCheckup}</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>Blood Test</h4>
                        <p>Annual blood work - Vitamin D deficiency detected</p>
                        <span className="timeline-date">1 month ago</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>Vaccination</h4>
                        <p>COVID-19 booster shot administered</p>
                        <span className="timeline-date">3 months ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="tab-content">
              <div className="activity-grid">
                <div className="activity-card">
                  <h3><FontAwesomeIcon icon={faAward} /> Achievements</h3>
                  <div className="achievements">
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faHeartbeat} className="achievement-icon health" />
                      <span>Health Champion</span>
                    </div>
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faCalendar} className="achievement-icon consistency" />
                      <span>Regular Checkups</span>
                    </div>
                    <div className="achievement-item">
                      <FontAwesomeIcon icon={faChartLine} className="achievement-icon progress" />
                      <span>Health Improver</span>
                    </div>
                  </div>
                </div>

                <div className="activity-card">
                  <h3><FontAwesomeIcon icon={faChartLine} /> Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <FontAwesomeIcon icon={faHeartbeat} />
                      <div className="activity-details">
                        <span className="activity-title">Health Assessment Completed</span>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <FontAwesomeIcon icon={faUser} />
                      <div className="activity-details">
                        <span className="activity-title">Doctor Consultation Booked</span>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <FontAwesomeIcon icon={faChartLine} />
                      <div className="activity-details">
                        <span className="activity-title">EQ Test Completed</span>
                        <span className="activity-time">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="settings-grid">
                <div className="settings-card">
                  <h3><FontAwesomeIcon icon={faBell} /> Notifications</h3>
                  <div className="settings-items">
                    <div className="setting-item">
                      <span>Health Reminders</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <span>Appointment Alerts</span>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <span>Medication Reminders</span>
                      <label className="toggle">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="settings-card">
                  <h3><FontAwesomeIcon icon={faLock} /> Privacy</h3>
                  <div className="settings-items">
                    <div className="setting-item">
                      <span>Profile Visibility</span>
                      <select className="setting-select">
                        <option>Private</option>
                        <option>Public</option>
                        <option>Friends Only</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <span>Data Sharing</span>
                      <label className="toggle">
                        <input type="checkbox" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
