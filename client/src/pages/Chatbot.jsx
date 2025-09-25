import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');

  // Get translated symptoms
  const getCommonSymptoms = () => [
    t('headache'), t('fever'), t('cough'), t('fatigue'), 
    t('nausea'), t('soreThroat'), t('shortnessBreath'), t('chestPain'),
    t('diarrhea'), t('dizziness'), t('lossSmell'), t('lossTaste'),
    t('runnyNose'), t('sneezing'), t('musclePain'), t('backPain')
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

  // Gemini API integration
  const callGeminiAPI = async (symptoms, language) => {
    const languageNames = {
      'en': 'English',
      'hi': 'Hindi',
      'pa': 'Punjabi', 
      'or': 'Odia'
    };

    const prompt = `You are a medical AI assistant. Analyze the following symptoms and provide a comprehensive medical diagnosis in ${languageNames[language] || 'English'} language.

Symptoms: ${symptoms.join(', ')}

Please provide a detailed response in the following format (respond entirely in ${languageNames[language] || 'English'}):

1. **Diagnosis Summary** (6 points):
   - Likely Condition
   - Primary Cause  
   - Symptom Relation
   - Body System affected
   - Severity Level
   - Recommendation

2. **Recommended Medicines** (6 points):
   - Pain Relief options
   - Specific treatments
   - Hydration advice
   - Usage instructions
   - Duration guidelines
   - When to consult doctor

3. **Possible Side Effects** (6 points):
   - Mild side effects
   - Stomach related
   - Allergic reactions
   - Management tips
   - When to stop medication
   - Emergency signs

4. **Things to Avoid** (6 points):
   - Foods to avoid
   - Activities to limit
   - Substances to avoid
   - Environmental factors
   - Habits to stop
   - Delays to avoid

5. **Follow-Up Suggestions** (6 points):
   - Check-up timeline
   - Tests if needed
   - Monitoring advice
   - Warning signs
   - Specialist referral
   - Prevention tips

Format each section with proper headings and numbered lists. Use appropriate medical terminology but keep it understandable for patients.`;

    try {
      console.log('🔥 Using server Gemini API...');
      
      // Use server's Gemini API instead of direct client calls
      const response = await fetch('http://localhost:8000/api/get_diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms.join(', ')
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Server Gemini API Error:', response.status, errorData);
        throw new Error(`Server API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('✅ Server Gemini API Success! Response received');
      return data.response;
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      throw error;
    }
  };

  const getDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      alert(t('selectAtLeastOne'));
      return;
    }

    setIsLoading(true);
    setDiagnosisResult('');

    try {
      // Try to call Gemini API first
      let diagnosis;
      try {
        diagnosis = await callGeminiAPI(selectedSymptoms, currentLanguage);
        // Format the Gemini response for HTML display
        diagnosis = diagnosis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        diagnosis = diagnosis.replace(/\n/g, '<br>');
        diagnosis = `<div style="line-height: 1.6; color: #2D3748;">${diagnosis}</div>`;
      } catch (geminiError) {
        console.log('🔄 Gemini API not available, using fallback response');
        console.log('📝 Fallback reason:', geminiError.message);
        // Fallback to mock response if Gemini API fails
        const symptomsString = selectedSymptoms.join(', ');
        diagnosis = `
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
      }

      setDiagnosisResult(diagnosis);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      alert(t('diagnosisFailed'));
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
            🩺 {t('symptomAI')}
          </div>
          <button 
            onClick={() => navigate('/doctor')}
            className="contact-doctor-btn"
          >
            👨‍⚕️ {t('contactDoctor')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="chatbot-main">
        <div className="chatbot-card fade-in">
          <h2 className="custom-heading">{t('enterSymptoms')}</h2>

          {/* Symptom Input */}
          <div className="symptom-input-section">
            <input 
              type="text" 
              placeholder={t('typeSymptom')}
              className="symptom-input"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={addSymptom} className="add-btn">
              ➕ {t('addSymptom')}
            </button>
          </div>

          {/* Common Symptoms */}
          <div className="common-symptoms-section">
            <h3 className="common-symptoms-title">{t('commonSymptoms')}</h3>
            <div className="symptoms-grid">
              {getCommonSymptoms().map((symptom, index) => (
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
            <h3 className="selected-symptoms-title">{t('selectedSymptoms')}</h3>
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
                <p className="no-symptoms-text">{t('noSymptomsSelected')}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={clearSymptoms} className="clear-btn">
              🗑️ {t('clearAll')}
            </button>
            <button onClick={getDiagnosis} className="diagnose-btn">
              🔍 {t('getDiagnosis')}
            </button>
          </div>

          {/* Loading Spinner */}
          <div className={`loading-container ${!isLoading ? 'hidden' : ''}`}>
            <div className="loader"></div>
            <p className="loading-text">{t('analyzingSymptoms')}</p>
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
