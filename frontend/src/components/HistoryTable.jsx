import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react'; // Removed unused icons
import Modal from './Modal';
import QuizCard from './QuizCard';

function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetch('https://wiki-quiz-app-6iaz.onrender.com/api/history')
      .then(res => res.json())
      .then(data => {
        console.log("History Data:", data); // Debugging line to see what data comes back
        setHistory(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'2rem', color: '#64748b'}}>Loading history...</div>;

  return (
    <>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div>
              {/* FIXED: Checks for 'topic', then 'title', then 'subject' */}
              <div className="history-title">
                {item.topic || item.title || item.subject || `Quiz #${item.id}`}
              </div>
              
              <div className="history-meta">
                {/* FIXED: Removed Emojis */}
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span style={{marginLeft: '10px', paddingLeft: '10px', borderLeft: '1px solid #cbd5e1'}}>
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button onClick={() => setSelectedQuiz(item)} className="view-btn">
              View
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedQuiz} onClose={() => setSelectedQuiz(null)}>
        {selectedQuiz && (
          <div>
            <h2>{selectedQuiz.topic || selectedQuiz.title || "Quiz Details"}</h2>
            <div className="summary-box" style={{marginTop: '1rem', background: '#f8fafc'}}>
              <h3 style={{fontSize: '1rem', color: '#2563eb', marginBottom: '0.5rem'}}>Summary</h3>
              {selectedQuiz.summary}
            </div>
            <div className="quiz-container" style={{marginTop: '1.5rem'}}>
              {selectedQuiz.questions.map((q, i) => (
                <QuizCard key={i} question={q} index={i} />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default HistoryTable;