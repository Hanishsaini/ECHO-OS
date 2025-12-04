import os
import json
from typing import Dict, Any
import openai

# Simple keyword-based mood detection
KEYWORDS = {
    "happy": ["happy", "joy", "excited", "great", "good", "awesome", "love"],
    "sad": ["sad", "depressed", "unhappy", "bad", "terrible", "cry", "grief"],
    "angry": ["angry", "mad", "furious", "hate", "rage", "annoyed"],
    "anxious": ["anxious", "nervous", "worried", "scared", "fear"],
    "neutral": ["okay", "fine", "normal"]
}

def detect_mood(text: str) -> Dict[str, Any]:
    """
    Detects mood from text using rule-based logic with OpenAI fallback.
    Returns: {emotion: str, intensity: int}
    """
    text_lower = text.lower()
    
    # 1. Rule-based detection
    for emotion, keywords in KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            # Simple intensity logic: count matches? For now, fixed intensity.
            return {"emotion": emotion, "intensity": 5}
            
    # 2. OpenAI Fallback
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Analyze the emotion of the user's text. Return JSON with 'emotion' (str) and 'intensity' (1-10 int)."
                },
                {"role": "user", "content": text}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Error in OpenAI mood detection: {e}")
        return {"emotion": "neutral", "intensity": 1}
