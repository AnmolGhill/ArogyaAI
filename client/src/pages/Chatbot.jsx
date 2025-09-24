import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Sore Throat',
    'Shortness of Breath', 'Chest Pain', 'Diarrhea', 'Dizziness',
    'Loss of Smell', 'Loss of Taste', 'Runny Nose', 'Sneezing',
    'Muscle Pain', 'Back Pain'
  ];

  const addSymptom = () => {
    if (symptomInput.trim() && !selectedSymptoms.includes(symptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const addPredefinedSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const clearSymptoms = () => {
    setSelectedSymptoms([]);
    setDiagnosisResult('');
  };

  const getDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    setIsLoading(true);
    setDiagnosisResult('');

    try {
      // In a real app, you would call your API here
      // For now, we'll simulate the API call
      const symptomsString = selectedSymptoms.join(', ');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock diagnosis response
      const mockDiagnosis = `
        <hr style='width: 100%; border: none; border-top: 2px solid #f28b82; margin: 2rem 0;'>
        
        <div>
          <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>📋 Diagnosis Summary</h3>
          <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
          <ol style='list-style-type: decimal; padding-left: 20px;'>
            <li><b>Likely Condition:</b> Based on symptoms (${symptomsString}), this appears to be a common viral infection</li>
            <li><b>Primary Cause:</b> Viral infection affecting respiratory system</li>
            <li><b>Symptom Relation:</b> Symptoms are consistent with upper respiratory tract infection</li>
            <li><b>Body System:</b> Respiratory and immune systems primarily affected</li>
            <li><b>Severity Level:</b> Mild to moderate - monitor symptoms closely</li>
            <li><b>Recommendation:</b> Rest, hydration, and symptom monitoring advised</li>
          </ol>
        </div>

        <div>
          <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>💊 Recommended Medicines</h3>
          <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
          <ol style='list-style-type: decimal; padding-left: 20px;'>
            <li><b>Pain Relief:</b> Paracetamol 500mg every 6-8 hours as needed</li>
            <li><b>Cough Relief:</b> Honey and warm water or OTC cough syrup</li>
            <li><b>Hydration:</b> Increase fluid intake - water, herbal teas</li>
            <li><b>Usage:</b> Take medications with food to avoid stomach upset</li>
            <li><b>Duration:</b> Continue for 3-5 days or until symptoms improve</li>
            <li><b>Consultation:</b> See doctor if symptoms worsen or persist beyond 7 days</li>
          </ol>
        </div>

        <div>
          <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>⚠️ Possible Side Effects</h3>
          <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
          <ol style='list-style-type: decimal; padding-left: 20px;'>
            <li><b>Mild:</b> Drowsiness from cough medications</li>
            <li><b>Stomach:</b> Nausea if medications taken on empty stomach</li>
            <li><b>Allergic:</b> Rare - rash, swelling, difficulty breathing</li>
            <li><b>Management:</b> Take with food, stay hydrated</li>
            <li><b>Stop If:</b> Severe allergic reaction, difficulty breathing</li>
            <li><b>Seek Help:</b> Emergency care for severe reactions</li>
          </ol>
        </div>

        <div>
          <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>🚫 Things to Avoid</h3>
          <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
          <ol style='list-style-type: decimal; padding-left: 20px;'>
            <li><b>Foods:</b> Avoid dairy if experiencing congestion</li>
            <li><b>Activities:</b> Avoid strenuous exercise until recovered</li>
            <li><b>Substances:</b> Limit alcohol and caffeine intake</li>
            <li><b>Environment:</b> Avoid cold air and polluted areas</li>
            <li><b>Habits:</b> No smoking - worsens respiratory symptoms</li>
            <li><b>Delays:</b> Don't delay medical care if symptoms worsen</li>
          </ol>
        </div>

        <div>
          <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>📅 Follow-Up Suggestions</h3>
          <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
          <ol style='list-style-type: decimal; padding-left: 20px;'>
            <li><b>Check-up:</b> See doctor if no improvement in 5-7 days</li>
            <li><b>Tests:</b> Blood test may be needed if fever persists</li>
            <li><b>Monitoring:</b> Track temperature and symptom severity daily</li>
            <li><b>Warning Signs:</b> High fever (>101.5°F), difficulty breathing</li>
            <li><b>Specialist:</b> ENT referral if symptoms become chronic</li>
            <li><b>Prevention:</b> Maintain good hygiene, adequate sleep</li>
          </ol>
        </div>
      `;

      setDiagnosisResult(mockDiagnosis);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      alert('Failed to get diagnosis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSymptom();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <header className="chatbot-header">
        <div className="header-content">
          <div className="symptom-ai-badge">
            🩺 Symptom AI
          </div>
          <button 
            onClick={() => navigate('/doctor')}
            className="contact-doctor-btn"
          >
            👨‍⚕️ Contact Doctor
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="chatbot-main">
        <div className="chatbot-card fade-in">
          <h2 className="custom-heading">Enter Your Symptoms</h2>

          {/* Symptom Input */}
          <div className="symptom-input-section">
            <input 
              type="text" 
              placeholder="Type a symptom (e.g. Headache)"
              className="symptom-input"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={addSymptom} className="add-btn">
              ➕ Add Symptom
            </button>
          </div>

          {/* Common Symptoms */}
          <div className="common-symptoms-section">
            <h3 className="common-symptoms-title">Common Symptoms</h3>
            <div className="symptoms-grid">
              {commonSymptoms.map((symptom, index) => (
                <button 
                  key={index}
                  onClick={() => addPredefinedSymptom(symptom)} 
                  className="symptom-tag"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Symptoms */}
          <div className="selected-symptoms-section">
            <h3 className="selected-symptoms-title">Selected Symptoms</h3>
            <div className="selected-symptoms-container">
              <div className="selected-symptoms">
                {selectedSymptoms.map((symptom, index) => (
                  <div key={index} className="selected-symptom-tag">
                    {symptom}
                    <button 
                      onClick={() => removeSymptom(symptom)}
                      className="remove-symptom"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {selectedSymptoms.length === 0 && (
                <p className="no-symptoms-text">No symptoms selected yet.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={clearSymptoms} className="clear-btn">
              🗑️ Clear All
            </button>
            <button onClick={getDiagnosis} className="diagnose-btn">
              🔍 Get Diagnosis
            </button>
          </div>

          {/* Loading Spinner */}
          <div className={`loading-container ${!isLoading ? 'hidden' : ''}`}>
            <div className="loader"></div>
            <p className="loading-text">Analyzing symptoms...</p>
          </div>

          {/* Diagnosis Output */}
          <div 
            className={`diagnosis-result ${!diagnosisResult ? 'hidden' : 'show'}`}
            dangerouslySetInnerHTML={{ __html: diagnosisResult }}
          />
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
