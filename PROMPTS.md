# 🧠 LangChain Prompt Templates

This project uses the following prompt templates to instruct the Groq (Llama 3) LLM.

## Quiz Generation Prompt
**Used in:** `backend/services.py`

```text
You are an AI teacher. Read the following text about "{title}" and generate a quiz.

TEXT CONTENT:
{text_content}

INSTRUCTIONS:
1. Create a 50-word summary.
2. Extract key entities (People, Organizations, Locations).
3. Generate 5 multiple-choice questions. Each question must have:
   - 'difficulty' (easy, medium, or hard)
   - 'explanation' (why the answer is correct)
4. Suggest 3 related topics.

FORMAT:
Strictly output valid JSON only. Do not add markdown blocks like ```json.

JSON STRUCTURE:
{{
    "summary": "...",
    "key_entities": {{
        "people": [],
        "organizations": [],
        "locations": []
    }},
    "quiz": [
        {{
            "question": "...",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option B",
            "difficulty": "medium",
            "explanation": "..."
        }}
    ],
    "related_topics": []
}}