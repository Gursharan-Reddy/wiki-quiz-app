import React, { useState } from 'react';
import { Layout } from 'lucide-react';
import QuizCard from './components/QuizCard';
import HistoryTable from './components/HistoryTable';
import './App.css'; // Make sure this import is here!

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz');

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setQuizData(null);

    try {
      const response = await fetch('https://wiki-quiz-app-6iaz.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');
      const data = await response.json();
      setQuizData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <Layout size={24} />
            <span>WikiQuiz AI</span>
          </div>
          
          <nav className="nav-tabs">
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            >
              New Quiz
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              Past Quizzes
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        
        {/* TAB 1: GENERATE QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            <div className="hero">
              <h2>Turn Wikipedia into a <span className="highlight">Quiz</span></h2>
              <p>Paste any Wikipedia article URL below and our AI will generate a unique interactive quiz instantly.</p>
            </div>

            <div className="input-group">
              <input
                type="url"
                placeholder="https://en.wikipedia.org/wiki/..."
                className="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !url}
                className="generate-btn"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>

            {error && <div className="error-msg" style={{color: 'red', textAlign:'center', marginTop:'1rem'}}>{error}</div>}

            {quizData && (
              <div style={{ marginTop: '2rem' }}>
                <div className="summary-box">
                  <h3>Summary</h3>
                  <p>{quizData.summary}</p>
                </div>

                <div className="quiz-container">
                  {quizData.quiz.map((q, i) => (
                    <QuizCard key={i} question={q} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === 'history' && (
          <div>
             <div className="hero">
              <h2>Your Quiz History</h2>
            </div>
            <HistoryTable />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;