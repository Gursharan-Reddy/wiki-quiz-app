🧠 WikiQuiz AI

WikiQuiz AI is a full-stack AI application that instantly turns any Wikipedia article into an interactive quiz. By combining modern web technologies with large language models, it makes learning engaging, fast, and exploratory.

✨ Features

Instant Quiz Generation
Paste a Wikipedia URL and receive a 5-question quiz within seconds.

AI-Powered Intelligence
Uses Groq (Llama 3.3) via LangChain to analyze content, generate summaries, extract key entities, and create questions.

Interactive Quiz UI
Playable quiz interface with instant feedback (Correct / Wrong) and detailed explanations for every answer.

History Tracking
Automatically saves every generated quiz in a PostgreSQL database for later review.

Topic Suggestions
The AI recommends related topics to encourage deeper exploration and learning.

🛠️ Tech Stack
Frontend

React.js

Vite

Lucide React (icons)

Backend

FastAPI (Python)

SQLAlchemy

Database

PostgreSQL

AI Engine

LangChain

Groq (Llama 3.3)

🚀 How to Run Locally
✅ Prerequisites

Make sure the following are installed and running:

Node.js (for frontend)

Python 3.10+

PostgreSQL (local instance)

1️⃣ Backend Setup

Navigate to the backend directory:

cd backend


Install dependencies:

pip install -r requirements.txt

Configuration (backend/.env)

Create a .env file inside the backend folder with the following content:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/wikiquizdb
GROQ_API_KEY=gsk_your_api_key_here


Get your Groq API key from:
https://console.groq.com/keys

Start the backend server:

python -m uvicorn main:app --reload


Backend will be available at:

http://localhost:8000

2️⃣ Frontend Setup

Open a new terminal and navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Frontend will run at:

http://localhost:5173

3️⃣ Usage

Open http://localhost:5173 in your browser

Paste a Wikipedia URL

Example: https://en.wikipedia.org/wiki/Steve_Jobs

Click Generate

Wait for the AI to create the quiz

Play the quiz and view instant feedback

Navigate to Past Quizzes to see saved quiz history

📡 API Endpoints
Method	Endpoint	Description
POST	/api/generate	Scrapes the Wikipedia URL and generates quiz data using AI
GET	/api/history	Retrieves all previously generated quizzes from the database
🧠 AI Prompt Template

This project uses LangChain to control the behavior of the Llama 3.3 model.
Below is the exact prompt template used for quiz generation.

Input Variables

{title}

{text_content}

Prompt (Plain Text)
You are an AI teacher. Read the following text about "{title}" and generate a quiz.

TEXT CONTENT:
{text_content}

INSTRUCTIONS:
1. Create a 50-word summary.
2. Extract key entities (People, Organizations, Locations).
3. Generate 5 multiple-choice questions. Each question must have:
   - difficulty (easy, medium, or hard)
   - explanation (why the answer is correct)
4. Suggest 3 related topics.

FORMAT:
Strictly output valid JSON only. Do not add markdown blocks like ```json.

JSON STRUCTURE:
{
    "summary": "...",
    "key_entities": {
        "people": [],
        "organizations": [],
        "locations": []
    },
    "quiz": [
        {
            "question": "...",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option B",
            "difficulty": "medium",
            "explanation": "..."
        }
    ],
    "related_topics": []
}

## 📸 Screenshots

### 1. Quiz Generation Page
![Quiz Page](screenshots/image.png)
![Quiz Page](screenshots/quiz.png)
![Quiz Page](screenshots/quiz1.png)

### 2. History View
![History Table](screenshots/history.png)

### 3. Answer Modal
![Details Modal](screenshots/answer.png)

📦 Project Structure
wiki-quiz-app/
│
├── backend/
│   ├── .env                 # Contains DATABASE_URL and GROQ_API_KEY
│   ├── main.py              # FastAPI app with routes
│   ├── services.py          # Wikipedia scraping + LangChain/Groq logic
│   ├── models.py            # Database tables
│   ├── schemas.py           # Pydantic models (Data validation)
│   ├── database.py          # Database connection
│   └── requirements.txt     # List of python libraries
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HistoryTable.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── QuizCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── sample_data/            
│   ├── urls.txt
│   └── example_output.json
│
├── PROMPTS.md              
├── README.md                
└── .gitignore

🔮 Future Enhancements

User authentication
Difficulty-based quiz modes
Timed quizzes and scoring
Support for non-Wikipedia sources
Export quizzes as PDF or shareable links