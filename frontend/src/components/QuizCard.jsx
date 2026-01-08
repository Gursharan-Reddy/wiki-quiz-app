import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

function QuizCard({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (opt) => {
    if (!showAnswer) {
      setSelectedOption(opt);
    }
  };

  const getOptionStyle = (opt) => {
    let baseStyle = {
      padding: '1rem',
      margin: '0.75rem 0',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      cursor: showAnswer ? 'default' : 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'white'
    };

    // 1. If user Selected this option (before showing answer)
    if (selectedOption === opt && !showAnswer) {
      baseStyle.border = '2px solid #2563eb'; // Blue border
      baseStyle.background = '#eff6ff'; // Light blue bg
    }

    // 2. If Answer is revealed
    if (showAnswer) {
      if (opt === question.answer) {
        // Correct Answer -> ALWAYS Green
        baseStyle.border = '2px solid #22c55e';
        baseStyle.background = '#dcfce7';
        baseStyle.fontWeight = '600';
      } else if (opt === selectedOption && selectedOption !== question.answer) {
        // Wrong Selection -> Red
        baseStyle.border = '2px solid #ef4444';
        baseStyle.background = '#fee2e2';
      }
    }

    return baseStyle;
  };

  const difficultyColor = {
    easy: { bg: '#dcfce7', text: '#166534' },
    medium: { bg: '#fef9c3', text: '#854d0e' },
    hard: { bg: '#fee2e2', text: '#991b1b' }
  };

  const diffStyle = difficultyColor[question.difficulty.toLowerCase()] || difficultyColor.medium;

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header: Question + Badge (Fixed Layout) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        gap: '1rem',
        marginBottom: '1rem' 
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '1.15rem', 
          lineHeight: '1.6',
          flex: 1 
        }}>
          {index + 1}. {question.question}
        </h4>
        
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 'bold',
          padding: '0.25rem 0.75rem',
          borderRadius: '99px',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap', // Prevents badge text from breaking
          backgroundColor: diffStyle.bg,
          color: diffStyle.text,
          alignSelf: 'flex-start' // Keeps it at the top
        }}>
          {question.difficulty}
        </span>
      </div>
      
      {/* Options List */}
      <div>
        {question.options.map((opt, i) => (
          <div 
            key={i} 
            onClick={() => handleOptionClick(opt)}
            style={getOptionStyle(opt)}
          >
            <span>{["A", "B", "C", "D"][i]}. {opt}</span>
            
            {/* Icons for Correct/Wrong */}
            {showAnswer && opt === question.answer && <CheckCircle size={20} color="#166534" />}
            {showAnswer && opt === selectedOption && opt !== question.answer && <XCircle size={20} color="#991b1b" />}
          </div>
        ))}
      </div>

      {/* Show Answer Button */}
      <button 
        onClick={() => setShowAnswer(!showAnswer)}
        style={{
          marginTop: '1rem',
          background: 'none',
          border: 'none',
          color: '#2563eb',
          fontWeight: '600',
          fontSize: '0.95rem',
          padding: 0,
          textDecoration: 'underline'
        }}
      >
        {showAnswer ? "Hide Explanation" : "Check Answer"}
      </button>

      {/* Explanation Box */}
      {showAnswer && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: '#f8fafc', 
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6',
          fontSize: '0.95rem',
          color: '#334155'
        }}>
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}

export default QuizCard;