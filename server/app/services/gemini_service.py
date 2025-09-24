"""
Gemini AI service for medical diagnosis - matches Node.js Gemini integration
"""
import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
        else:
            logger.warning("⚠️ Google API key not configured")
            self.model = None

    async def get_diagnosis(self, symptoms: str) -> str:
        """
        Get AI diagnosis from Gemini - matches the Node.js diagnosis logic exactly
        """
        if not self.model:
            raise Exception("Gemini AI not configured")

        if not symptoms.strip():
            raise ValueError("No symptoms provided")

        # Exact same prompt as Node.js backend
        prompt = f"""You are a medical assistant. A user reports: "{symptoms}".

Generate a professional HTML response with the following structure. Use <div> containers and <ol><li> for numbered bullet points. Each section must include exactly 6 points, and each point should begin with a <b>label</b> summarizing its meaning.

Use this reusable template:

---
<hr style='width: 100%; border: none; border-top: 2px solid #f28b82; margin: 2rem 0;'>

<div>
  <h3 style='font-size:1.1rem; color:#003153; font-weight:bold;'>[Emoji + Title]</h3>
  <hr style='margin: 0.2rem 0 1rem 0; border: none; border-top: 1px solid #ccc;'>
  <ol style='list-style-type: decimal; padding-left: 20px;'>
    <li><b>[Label]:</b> [Point content]</li>
    ...
    <li><b>[Label]:</b> [Point content]</li>
  </ol>
</div>

---

Include these 5 sections:
1. 📋 Diagnosis Summary – (Condition, Cause, Symptom Relation, Body System, Severity, Uncertainty)
2. 💊 Recommended Medicines – (Primary Drug, Supplement, OTC, Usage, Duration, Consultation)
3. ⚠️ Possible Side Effects – (Common, Rare, Management, Critical Signs)
4. 🚫 Things to Avoid – (Food, Activities, Interactions, Triggers, Habits, Delay)
5. 📅 Follow-Up Suggestions – (Visit, Tests, Monitoring, Red Flags, Specialists, Tools)

Respond only with complete, valid HTML. No additional comments."""

        try:
            result = self.model.generate_content(prompt)
            response = result.text
            
            if not response:
                raise Exception("No response from Gemini API")
            
            logger.info("✅ Gemini diagnosis generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {e}")
            raise Exception("Failed to get diagnosis")

    async def test_ai_connection(self) -> str:
        """Test Gemini AI connection"""
        if not self.model:
            raise Exception("Gemini AI not configured")
        
        try:
            result = self.model.generate_content("Hello, Gemini!")
            return result.text
        except Exception as e:
            logger.error(f"❌ Gemini test failed: {e}")
            raise Exception("Gemini AI test failed")

# Global Gemini service instance
gemini_service = GeminiService()
