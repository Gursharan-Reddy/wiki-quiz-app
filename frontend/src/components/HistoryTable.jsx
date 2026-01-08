import React, { useEffect, useState } from 'react';
import { Eye, Calendar, Clock } from 'lucide-react';
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
        setHistory(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'2rem'}}>Loading history...</div>;

  return (
    <>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div>
              <div className="history-title">{item.topic || "Unknown Topic"}</div>
              <div className="history-meta">
                <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
                <span>⏰ {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            <h2>{selectedQuiz.topic}</h2>
            <div className="summary-box" style={{marginTop: '1rem', background: '#f8fafc'}}>
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