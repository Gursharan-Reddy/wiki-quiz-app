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

  const getOptionClass = (opt) => {
    if (showAnswer) {
      if (opt === question.answer) return 'option-btn correct';
      if (opt === selectedOption && opt !== question.answer) return 'option-btn wrong';
    }
    if (selectedOption === opt) return 'option-btn selected';
    return 'option-btn';
  };

  const difficultyClass = `difficulty-badge badge-${question.difficulty.toLowerCase()}`;

  return (
    <div className="question-card">
      <div className="question-header">
        <h4>{index + 1}. {question.question}</h4>
        <span className={difficultyClass}>{question.difficulty}</span>
      </div>
      
      <div>
        {question.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleOptionClick(opt)}
            className={getOptionClass(opt)}
            disabled={showAnswer}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{["A", "B", "C", "D"][i]}. {opt}</span>
              {showAnswer && opt === question.answer && <CheckCircle size={18} />}
              {showAnswer && opt === selectedOption && opt !== question.answer && <XCircle size={18} />}
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => setShowAnswer(!showAnswer)} className="check-btn">
        {showAnswer ? "Hide Explanation" : "Check Answer"}
      </button>

      {showAnswer && (
        <div className="explanation">
          <strong>Explanation:</strong> {question.explanation}
        </div>
      )}
    </div>
  );
}

export default QuizCard;