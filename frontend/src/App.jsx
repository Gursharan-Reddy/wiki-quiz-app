import React, { useState } from 'react';
import { Loader2, BookOpen, History, Layout } from 'lucide-react';
import QuizCard from './components/QuizCard';
import HistoryTable from './components/HistoryTable';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'history'

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setQuizData(null);

    try {
      // UPDATED: Using your live Render Backend URL
      const response = await fetch('https://wiki-quiz-app-6iaz.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuizData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Layout className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">WikiQuiz AI</h1>
          </div>
          
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'quiz' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Quiz
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Quizzes
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        
        {/* TAB 1: GENERATE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Turn Wikipedia into a <span className="text-blue-600">Quiz</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Paste any Wikipedia article URL below and our AI will generate a unique interactive quiz instantly.
              </p>
            </div>

            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-2">
              <input
                type="url"
                placeholder="https://en.wikipedia.org/wiki/..."
                className="flex-1 px-4 py-3 rounded-lg bg-transparent focus:outline-none text-slate-700 placeholder:text-slate-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !url}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Generate"}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            {quizData && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-blue-600">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Summary</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{quizData.summary}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 px-2">Quiz Questions</h3>
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
          <div className="space-y-6">
             <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Your Quiz History</h2>
              <p className="text-slate-500 mt-2">Revisit your past generated quizzes</p>
            </div>
            <HistoryTable />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;