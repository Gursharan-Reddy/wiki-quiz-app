import React, { useEffect, useState } from 'react';
import { Eye, Calendar, Clock, ArrowRight } from 'lucide-react';
import Modal from './Modal';
import QuizCard from './QuizCard';

function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null); // Controls the popup

  useEffect(() => {
    // UPDATED: Using your live Render Backend URL
    fetch('https://wiki-quiz-app-6iaz.onrender.com/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load history:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12 text-slate-500">Loading history...</div>;
  if (history.length === 0) return <div className="text-center py-12 text-slate-500">No quizzes generated yet.</div>;

  return (
    <>
      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {item.topic || "Unknown Topic"}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedQuiz(item)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          </div>
        ))}
      </div>

      {/* POPUP MODAL */}
      <Modal isOpen={!!selectedQuiz} onClose={() => setSelectedQuiz(null)}>
        {selectedQuiz && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-slate-900">{selectedQuiz.topic}</h2>
              <p className="text-slate-500 mt-1">Generated Summary</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-slate-700 leading-relaxed text-sm">
              {selectedQuiz.summary}
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-lg">Questions</h3>
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