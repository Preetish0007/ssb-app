# server.py - Updated for Hugging Face API
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import uuid
import aiohttp

# Load environment variables
load_dotenv()

app = FastAPI(title="SSB Preparation App API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(MONGO_URL)
db = client.ssb_prep_app

# Hugging Face API Key
HF_API_KEY = os.environ.get("HF_API_KEY")

# ----------------- Pydantic Models -----------------
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PracticeSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    test_type: str
    content: Dict[str, Any]
    score: Optional[float] = None
    ai_feedback: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: str = "medium"

class UserProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    test_type: str
    total_attempts: int = 0
    correct_answers: int = 0
    average_score: float = 0.0
    streak: int = 0
    last_practice: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message: str
    response: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ----------------- AI Helper Function -----------------
async def get_ai_response(system_message: str, user_message: str, session_id: str = None):
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "inputs": f"{system_message}\nUser: {user_message}\nAssistant:",
                "options": {"wait_for_model": True}
            }
            headers = {"Authorization": f"Bearer {HF_API_KEY}"}
            async with session.post(
                "https://api-inference.huggingface.co/models/gpt2",
                headers=headers,
                json=payload
            ) as resp:
                data = await resp.json()
                if isinstance(data, list) and "generated_text" in data[0]:
                    return data[0]["generated_text"]
                elif isinstance(data, dict) and "error" in data:
                    return f"AI Error: {data['error']}"
                else:
                    return str(data)
    except Exception as e:
        print(f"AI Response Error: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."

# ----------------- API Endpoints -----------------
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SSB Preparation App"}

# ----------------- OIR Endpoints -----------------
@app.get("/api/oir/questions")
async def get_oir_questions():
    questions = [
        {
            "id": "oir_1",
            "question": "If MONDAY is coded as NPOEBZ, how is FRIDAY coded?",
            "options": ["GSJEBZ", "GSJFBZ", "GSJDBZ", "GSJECZ"],
            "correct_answer": 0,
            "explanation": "Each letter is shifted by +1 position in the alphabet.",
            "difficulty": "medium"
        },
        {
            "id": "oir_2", 
            "question": "In a certain code, LOGIC is written as MPHKD. How is BRAIN written?",
            "options": ["CSBKO", "CSBJO", "DSBJO", "CSCJO"],
            "correct_answer": 1,
            "explanation": "Each letter is shifted by +1 position in the alphabet.",
            "difficulty": "medium"
        }
    ]
    return {"questions": questions}

@app.post("/api/oir/submit")
async def submit_oir_answer(data: dict):
    user_answer = data.get("answer")
    question_id = data.get("question_id")
    correct_answer = data.get("correct_answer")
    
    is_correct = user_answer == correct_answer
    score = 1 if is_correct else 0
    
    feedback_prompt = f"""
    You are an SSB preparation mentor. A candidate answered an OIR question.
    Question ID: {question_id}
    Their answer: {user_answer}
    Correct answer: {correct_answer}
    Result: {'Correct' if is_correct else 'Incorrect'}
    Provide brief, encouraging feedback focusing on concepts and tips.
    """
    
    ai_feedback = await get_ai_response(
        "You are a supportive SSB preparation mentor.",
        feedback_prompt
    )
    
    return {"correct": is_correct, "score": score, "feedback": ai_feedback}

# ----------------- Chat Mentor -----------------
@app.post("/api/chat/mentor")
async def chat_with_mentor(data: dict):
    user_message = data.get("message")
    user_id = data.get("user_id", "anonymous")
    
    mentor_prompt = f"""
    You are an experienced SSB mentor and retired military officer.
    User question: "{user_message}"
    Provide helpful, motivational advice in BULLET POINTS.
    """
    
    ai_response = await get_ai_response(
        "You are a supportive SSB mentor with years of experience.",
        mentor_prompt
    )
    
    chat_data = {
        "user_id": user_id,
        "message": user_message,
        "response": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.chat_history.insert_one(chat_data)
    
    return {"response": ai_response}

# ----------------- Progress -----------------
@app.get("/api/progress/{user_id}")
async def get_user_progress(user_id: str):
    progress = {
        "user_id": user_id,
        "practice_streak": 7,
        "total_sessions": 25,
        "average_scores": {"OIR": 75, "PPDT": 80, "TAT": 70, "WAT": 85, "SRT": 78},
        "strengths": ["Leadership", "Problem Solving", "Communication"],
        "areas_for_improvement": ["Time Management", "Stress Handling"],
        "next_recommendations": [
            "Practice more OIR questions",
            "Work on TAT responses",
            "Improve interview confidence"
        ]
    }
    return progress

# ----------------- Run Server -----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
