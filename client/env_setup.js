// Quick environment setup for development
// Run this in the browser console to set up environment variables

console.log('🔧 Setting up development environment...');

// Set API base URL
window.localStorage.setItem('VITE_API_BASE_URL', 'http://localhost:8000');

// Mock Firebase config for testing (replace with real values)
const mockFirebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Store in localStorage for the app to use
Object.keys(mockFirebaseConfig).forEach(key => {
  window.localStorage.setItem(`VITE_FIREBASE_${key.toUpperCase()}`, mockFirebaseConfig[key]);
});

console.log('✅ Environment setup complete!');
console.log('📊 API Base URL:', window.localStorage.getItem('VITE_API_BASE_URL'));
console.log('🔥 Firebase Config:', mockFirebaseConfig);
console.log('🔄 Please refresh the page for changes to take effect.');
