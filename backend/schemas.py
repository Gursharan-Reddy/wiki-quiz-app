from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

# Input Schema (What the user sends)
class QuizRequest(BaseModel):
    url: str

# Helper Schema for a single question
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

# Output Schema (What the API sends back)
class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]]
    sections: List[str]
    quiz: List[QuizQuestion]
    related_topics: List[str]
    created_at: datetime

    class Config:
        from_attributes = True