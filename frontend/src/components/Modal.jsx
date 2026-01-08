import React from 'react';
import QuizCard from './QuizCard';
import './Modal.css';
import { X } from 'lucide-react';

function Modal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2>{data.title}</h2>
        <p className="summary">{data.summary}</p>
        
        <h3>Quiz Questions</h3>
        {data.quiz.map((q, idx) => (
          <QuizCard key={idx} question={q} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default Modal;