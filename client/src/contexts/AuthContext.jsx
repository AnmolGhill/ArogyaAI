import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuthService, firestoreService } from '../services/firebase';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          setCurrentUser(user);
          
          // Get Firebase ID token and verify with backend
          const tokenResult = await firebaseAuthService.getIdToken();
          if (tokenResult.success) {
            const response = await apiService.firebaseAuth.verifyToken(tokenResult.token);
            if (response.data) {
              setUserProfile(response.data);
              
              // Store user data in localStorage for compatibility
              const userData = {
                userId: response.data.userId,
                firebase_uid: response.data.firebase_uid,
                email: response.data.email,
                name: response.data.name,
                token: tokenResult.token
              };
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);

      // Create Firebase user
      const result = await firebaseAuthService.registerWithEmail(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Create user profile in backend
      if (additionalData.name && additionalData.age) {
        const tokenResult = await firebaseAuthService.getIdToken();
        if (tokenResult.success) {
          const userData = {
            name: additionalData.name,
            age: additionalData.age,
            email: email
          };
          
          await apiService.firebaseAuth.registerWithProfile(userData, tokenResult.token);
        }
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const result = await firebaseAuthService.signInWithEmail(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await firebaseAuthService.signInWithGoogle();
      if (!result.success) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseAuthService.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      if (userProfile) {
        const tokenResult = await firebaseAuthService.getIdToken();
        if (tokenResult.success) {
          // Update profile via API
          const response = await apiService.firebaseAuth.registerWithProfile(profileData, tokenResult.token);
          if (response.data) {
            setUserProfile(response.data);
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
