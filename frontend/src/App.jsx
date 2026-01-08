import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, BrainCircuit, Loader2 } from 'lucide-react';
import QuizCard from './components/QuizCard';
import HistoryTable from './components/HistoryTable';
import Modal from './components/Modal';
import './App.css';

const API_URL = "http://localhost:8000/api";

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleGenerate = async () => {
    if (!url.includes('wikipedia.org')) {
      setError("Please enter a valid Wikipedia URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setQuizData(null);
    
    try {
      const res = await axios.post(`${API_URL}/generate`, { url });
      setQuizData(res.data);
      fetchHistory();
    } catch (err) {
      setError("Failed to generate quiz. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <BrainCircuit size={32} color="#2563eb" />
        <h1>WikiQuiz AI</h1>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Quiz
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Past Quizzes
        </button>
      </div>

      {activeTab === 'generate' && (
        <>
          <div className="input-section">
            <label>Wikipedia Article URL</label>
            <div className="input-group">
              <input 
                type="text" 
                className="url-input"
                placeholder="https://en.wikipedia.org/wiki/Steve_Jobs"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                className="generate-btn" 
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? <Loader2 className="spin" size={20}/> : "Generate"}
              </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>

          {quizData && (
            <div className="results-section">
              <div className="summary-card">
                <h2>{quizData.title}</h2>
                <p>{quizData.summary}</p>
                
                <div className="entities-grid">
                  <div className="entity-box people">
                    <strong>People:</strong> {quizData.key_entities.people?.join(", ")}
                  </div>
                  <div className="entity-box orgs">
                    <strong>Orgs:</strong> {quizData.key_entities.organizations?.join(", ")}
                  </div>
                  <div className="entity-box locs">
                    <strong>Locations:</strong> {quizData.key_entities.locations?.join(", ")}
                  </div>
                </div>
              </div>

              <h3 className="section-title">Quiz Questions</h3>
              {quizData.quiz.map((q, idx) => (
                <QuizCard key={idx} question={q} index={idx} />
              ))}

              <h3 className="section-title">Related Topics</h3>
              <div className="topics-list">
                {quizData.related_topics.map((t, i) => (
                  <span key={i} className="topic-tag">{t}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <HistoryTable 
          history={history} 
          onView={(item) => setSelectedHistoryItem(item)} 
        />
      )}

      {selectedHistoryItem && (
        <Modal 
          data={selectedHistoryItem} 
          onClose={() => setSelectedHistoryItem(null)} 
        />
      )}
    </div>
  );
}

export default App;