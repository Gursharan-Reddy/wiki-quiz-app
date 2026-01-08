from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    
    # Stores the short summary text
    summary = Column(Text)
    
    # Stores lists like ["Person A", "Person B"] as JSON
    key_entities = Column(JSON)
    
    # Stores the list of sections as JSON
    sections = Column(JSON)
    
    # Stores the actual list of questions and answers as JSON
    quiz_data = Column(JSON)
    
    # Stores related topics as JSON
    related_topics = Column(JSON)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())