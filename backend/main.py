from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, services, database
import traceback # Added for debugging

# Create Database Tables automatically
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Wiki Quiz API")

# Enable CORS so the React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes ---

@app.post("/api/generate", response_model=schemas.QuizResponse)
def generate_quiz(request: schemas.QuizRequest, db: Session = Depends(database.get_db)):
    print(f"--- Processing URL: {request.url} ---") # Debug Print

    # 1. Check History
    existing_quiz = db.query(models.QuizSession).filter(models.QuizSession.url == request.url).first()
    if existing_quiz:
        print("Found in cache!")
        return map_db_to_response(existing_quiz)

    # 2. Scrape
    try:
        print("Step 1: Scraping...")
        scraped_data = services.scrape_wikipedia(request.url)
        print("Scraping Successful!")
    except Exception as e:
        print(f"SCRAPING ERROR: {e}") # Print error to terminal
        raise HTTPException(status_code=400, detail=f"Scraping failed: {str(e)}")

    # 3. AI Generation
    try:
        print("Step 2: Calling AI (Groq)...")
        ai_data = services.generate_quiz_content(scraped_data)
        print("AI Generation Successful!")
    except Exception as e:
        # This will print the EXACT reason why the AI failed
        print("AI GENERATION ERROR:")
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

    # 4. Save to Database
    try:
        print("Step 3: Saving to DB...")
        new_quiz = models.QuizSession(
            url=request.url,
            title=scraped_data["title"],
            sections=scraped_data["sections"],
            summary=ai_data["summary"],
            key_entities=ai_data["key_entities"],
            quiz_data=ai_data["quiz"],
            related_topics=ai_data["related_topics"]
        )
        db.add(new_quiz)
        db.commit()
        db.refresh(new_quiz)
        print("Saved to DB!")
    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    return map_db_to_response(new_quiz)

@app.get("/api/history", response_model=list[schemas.QuizResponse])
def get_history(db: Session = Depends(database.get_db)):
    quizzes = db.query(models.QuizSession).order_by(models.QuizSession.created_at.desc()).all()
    return [map_db_to_response(q) for q in quizzes]

def map_db_to_response(db_obj):
    return {
        "id": db_obj.id,
        "url": db_obj.url,
        "title": db_obj.title,
        "summary": db_obj.summary,
        "key_entities": db_obj.key_entities,
        "sections": db_obj.sections,
        "quiz": db_obj.quiz_data,
        "related_topics": db_obj.related_topics,
        "created_at": db_obj.created_at
    }