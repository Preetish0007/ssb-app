from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import uuid
from emergentintegrations.llm.chat import LlmChat, UserMessage

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

# Claude AI Integration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PracticeSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    test_type: str  # OIR, PPDT, TAT, WAT, SRT, SD
    content: Dict[str, Any]
    score: Optional[float] = None
    ai_feedback: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class QuizQuestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str  # OIR, Defense_GK, Current_Affairs
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

# AI Helper Function
async def get_ai_response(system_message: str, user_message: str, session_id: str = None):
    try:
        if not session_id:
            session_id = str(uuid.uuid4())
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        ).with_model("anthropic", "claude-3-5-sonnet-20241022")
        
        user_msg = UserMessage(text=user_message)
        response = await chat.send_message(user_msg)
        return response
    except Exception as e:
        print(f"AI Response Error: {e}")
        return "I apologize, but I'm having trouble processing your request right now. Please try again later."

# API Endpoints

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SSB Preparation App"}

# OIR Practice Endpoints
@app.get("/api/oir/questions")
async def get_oir_questions():
    questions = [
        {
            "id": "oir_1",
            "question": "If MONDAY is coded as NPOEBZ, how is FRIDAY coded?",
            "options": ["GSJEBZ", "GSJFBZ", "GSJDBZ", "GSJECZ"],
            "correct_answer": 0,
            "explanation": "Each letter is shifted by +1 position in the alphabet. F→G, R→S, I→J, D→E, A→B, Y→Z",
            "difficulty": "medium"
        },
        {
            "id": "oir_2", 
            "question": "In a certain code, LOGIC is written as MPHKD. How is BRAIN written?",
            "options": ["CSBKO", "CSBJO", "DSBJO", "CSCJO"],
            "correct_answer": 1,
            "explanation": "Each letter is shifted by +1 position. B→C, R→S, A→B, I→J, N→O",
            "difficulty": "medium"
        },
        {
            "id": "oir_3",
            "question": "Complete the series: 2, 6, 12, 20, 30, ?",
            "options": ["40", "42", "44", "46"],
            "correct_answer": 1,
            "explanation": "The pattern is n×(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
            "difficulty": "easy"
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
    
    # Get AI feedback
    feedback_prompt = f"""
    You are an SSB preparation mentor. A candidate answered an OIR question.
    Question ID: {question_id}
    Their answer: {user_answer}
    Correct answer: {correct_answer}
    Result: {'Correct' if is_correct else 'Incorrect'}
    
    Provide brief, encouraging feedback focusing on:
    1. Concept explanation if wrong
    2. Strategy tips for similar questions
    3. Positive reinforcement
    Keep it under 150 words.
    """
    
    ai_feedback = await get_ai_response(
        "You are a supportive SSB preparation mentor who provides constructive feedback.",
        feedback_prompt
    )
    
    return {
        "correct": is_correct,
        "score": score,
        "feedback": ai_feedback
    }

# Enhanced PP&DT Endpoints with black and white hazy images
@app.get("/api/ppdt/images")
async def get_ppdt_images():
    images = [
        {
            "id": "ppdt_1",
            "url": "https://images.unsplash.com/photo-1640286032211-db0f59a828b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxibGFjayUyMHdoaXRlJTIwaGF6eXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTY3OTEzNTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Car in foggy conditions - atmospheric"
        },
        {
            "id": "ppdt_2", 
            "url": "https://images.unsplash.com/photo-1710839971665-614255a5d0a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxibGFjayUyMHdoaXRlJTIwaGF6eXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTY3OTEzNTl8MA&ixlib=rb-4.1.0&q=85",
            "description": "Flower in vase - soft ambiguous"
        },
        {
            "id": "ppdt_3",
            "url": "https://images.unsplash.com/photo-1564537150296-07c166b5049d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHw0fHxibGFjayUyMHdoaXRlJTIwaGF6eXxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTY3OTEzNTl8MA&ixlib=rb-4.1.0&q=85", 
            "description": "Smoking man - atmospheric"
        },
        {
            "id": "ppdt_4",
            "url": "https://images.pexels.com/photos/9665195/pexels-photo-9665195.jpeg",
            "description": "Atmospheric pexels image"
        },
        {
            "id": "ppdt_5",
            "url": "https://images.unsplash.com/photo-1543572974-ab8f3d347ccb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxtb25vY2hyb21lJTIwYXRtb3NwaGVyaWN8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzU2NzkxMzY2fDA&ixlib=rb-4.1.0&q=85",
            "description": "Hazy trees scene - perfect atmospheric"
        },
        {
            "id": "ppdt_6",
            "url": "https://images.unsplash.com/photo-1603252059794-03f65d8ccbd4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxtb25vY2hyb21lJTIwYXRtb3NwaGVyaWN8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzU2NzkxMzY2fDA&ixlib=rb-4.1.0&q=85", 
            "description": "Creepy house - excellent for story creation"
        },
        {
            "id": "ppdt_7",
            "url": "https://images.unsplash.com/photo-1715759406117-76aeee4281a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxtb25vY2hyb21lJTIwYXRtb3NwaGVyaWN8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzU2NzkxMzY2fDA&ixlib=rb-4.1.0&q=85",
            "description": "Abandoned building - atmospheric decay"
        },
        {
            "id": "ppdt_8",
            "url": "https://images.unsplash.com/photo-1587723354049-ff731dabf35f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxtb25vY2hyb21lJTIwYXRtb3NwaGVyaWN8ZW58MHx8fGJsYWNrX2FuZF93aGl0ZXwxNzU2NzkxMzY2fDA&ixlib=rb-4.1.0&q=85",
            "description": "Lonely mountain hut - evocative"
        }
    ]
    return {"images": images}

@app.post("/api/ppdt/submit")
async def submit_ppdt_story(data: dict):
    user_story = data.get("story")
    image_id = data.get("image_id")
    
    # AI evaluation and positive story generation
    evaluation_prompt = f"""
    You are an SSB psychologist evaluating a PP&DT response. 
    
    User's story: "{user_story}"
    Image ID: {image_id}
    
    Please provide:
    1. Brief evaluation of the story (personality insights, leadership qualities shown)
    2. Areas for improvement
    3. Score out of 10
    
    Then create your own POSITIVE story for the same image that:
    - Starts with a clear REASON/motivation
    - Has a specific GOAL the protagonist wants to achieve  
    - Ends with a GREAT/positive outcome
    - Shows leadership, problem-solving, and positive attitude
    
    Format your response as:
    EVALUATION: [your evaluation and score]
    
    POSITIVE STORY EXAMPLE:
    [Your positive story here]
    """
    
    ai_response = await get_ai_response(
        "You are an experienced SSB psychologist who evaluates candidates and provides constructive feedback with positive examples.",
        evaluation_prompt
    )
    
    return {
        "evaluation": ai_response,
        "submitted_story": user_story
    }

# TAT, WAT, SRT, SD Endpoints
@app.get("/api/tat/scenarios")
async def get_tat_scenarios():
    scenarios = [
        {
            "id": "tat_1",
            "scenario": "You see a young officer standing alone on a hill, looking at a distant village with smoke rising from it.",
            "time_limit": 300
        },
        {
            "id": "tat_2", 
            "scenario": "A group of cadets are gathered around a fallen tree blocking their path during a training exercise.",
            "time_limit": 300
        },
        {
            "id": "tat_3",
            "scenario": "A cadet is sitting with books scattered around, looking thoughtful before an important exam.",
            "time_limit": 300
        }
    ]
    return {"scenarios": scenarios}

@app.post("/api/tat/submit")
async def submit_tat_response(data: dict):
    response = data.get("response")
    scenario_id = data.get("scenario_id")
    
    feedback_prompt = f"""
    Evaluate this TAT response for SSB preparation:
    Scenario ID: {scenario_id}
    Response: "{response}"
    
    Analyze for:
    1. Leadership qualities shown
    2. Problem-solving approach
    3. Positive attitude and determination
    4. Realistic thinking
    5. Score out of 10
    
    Provide constructive feedback in under 200 words.
    """
    
    ai_feedback = await get_ai_response(
        "You are an SSB psychologist evaluating TAT responses with focus on officer-like qualities.",
        feedback_prompt
    )
    
    return {"feedback": ai_feedback}

@app.get("/api/wat/words")
async def get_wat_words():
    words = [
        "CHALLENGE", "LEADERSHIP", "COURAGE", "FAILURE", "SUCCESS", 
        "TEAM", "CONFLICT", "OPPORTUNITY", "RISK", "GOAL",
        "SACRIFICE", "DUTY", "HONOR", "DISCIPLINE", "INITIATIVE"
    ]
    return {"words": words}

@app.post("/api/wat/submit")
async def submit_wat_responses(data: dict):
    responses = data.get("responses")  # List of word-response pairs
    
    feedback_prompt = f"""
    Evaluate these WAT responses for SSB:
    Responses: {responses}
    
    Analyze the overall personality pattern, positive vs negative associations, 
    and officer-like qualities. Provide insights and score out of 10.
    Keep feedback under 200 words.
    """
    
    ai_feedback = await get_ai_response(
        "You are an SSB psychologist analyzing WAT responses for personality assessment.",
        feedback_prompt
    )
    
    return {"feedback": ai_feedback}

@app.get("/api/srt/situations")
async def get_srt_situations():
    situations = [
        {
            "id": "srt_1",
            "situation": "You are leading a team project and one member is not contributing properly, affecting the whole team's performance."
        },
        {
            "id": "srt_2",
            "situation": "During a training exercise, you notice a fellow cadet is struggling and falling behind the group."
        },
        {
            "id": "srt_3", 
            "situation": "You have been falsely accused of cheating in an important exam by a classmate."
        }
    ]
    return {"situations": situations}

@app.post("/api/srt/submit")
async def submit_srt_responses(data: dict):
    responses = data.get("responses")
    
    feedback_prompt = f"""
    Evaluate these SRT responses for SSB:
    Responses: {responses}
    
    Analyze for leadership, quick decision-making, practical solutions, 
    and officer-like qualities. Score out of 10 and provide improvement suggestions.
    """
    
    ai_feedback = await get_ai_response(
        "You are an SSB evaluator analyzing SRT responses for practical leadership skills.",
        feedback_prompt
    )
    
    return {"feedback": ai_feedback}

# Interview Simulator
@app.post("/api/interview/start")
async def start_interview():
    questions = [
        "Tell me about yourself and why you want to join the armed forces.",
        "Describe a challenging situation you faced and how you handled it.",
        "What are your strengths and weaknesses?",
        "How do you handle pressure and stress?",
        "What is your understanding of leadership?"
    ]
    return {"questions": questions}

@app.post("/api/interview/submit")
async def submit_interview_answer(data: dict):
    answer = data.get("answer")
    question = data.get("question")
    
    feedback_prompt = f"""
    Evaluate this SSB interview response:
    Question: "{question}"
    Answer: "{answer}"
    
    Provide feedback on:
    1. Content quality and relevance
    2. Confidence level apparent in response
    3. Officer-like qualities demonstrated
    4. Areas for improvement
    5. Follow-up question to ask
    
    Keep total response under 250 words.
    """
    
    ai_feedback = await get_ai_response(
        "You are an SSB interviewing officer providing constructive feedback and follow-up questions.",
        feedback_prompt
    )
    
    return {"feedback": ai_feedback}

# Defense GK and Current Affairs
@app.get("/api/defense-gk/quiz")
async def get_defense_gk_quiz():
    questions = [
        {
            "id": "def_1",
            "question": "What is the motto of the Indian Army?",
            "options": ["Service Before Self", "Sarvatra Vijay", "Seva Paramo Dharma", "Shaurya Aur Samman"],
            "correct_answer": 0,
            "explanation": "'Service Before Self' is the motto of the Indian Army, emphasizing selfless service to the nation."
        },
        {
            "id": "def_2",
            "question": "Which is India's first indigenous aircraft carrier?",
            "options": ["INS Vikrant", "INS Vikramaditya", "INS Viraat", "INS Chakra"],
            "correct_answer": 0,
            "explanation": "INS Vikrant (IAC-1) is India's first indigenously built aircraft carrier, commissioned in 2022."
        },
        {
            "id": "def_3",
            "question": "What does 'DRDO' stand for?",
            "options": ["Defence Research Development Organisation", "Defence Research and Development Organisation", "Defence and Research Development Office", "Defence Research Development Office"],
            "correct_answer": 1,
            "explanation": "DRDO stands for Defence Research and Development Organisation, India's premier defence R&D establishment."
        }
    ]
    return {"questions": questions}

@app.get("/api/current-affairs/quiz")
async def get_current_affairs_quiz():
    questions = [
        {
            "id": "ca_1",
            "question": "Which country recently became NATO's newest member in 2024?",
            "options": ["Sweden", "Finland", "Ukraine", "Moldova"],
            "correct_answer": 0,
            "explanation": "Sweden officially became NATO's 32nd member in March 2024, following Finland's membership in 2023."
        },
        {
            "id": "ca_2",
            "question": "India's G20 presidency concluded with which major summit?",
            "options": ["Mumbai Summit", "Delhi Summit", "Bangalore Summit", "Chennai Summit"], 
            "correct_answer": 1,
            "explanation": "India's G20 presidency concluded with the New Delhi Summit in September 2023."
        }
    ]
    return {"questions": questions}

# GTO Task Guidance
@app.get("/api/gto/tasks")
async def get_gto_tasks():
    tasks = [
        {
            "id": "pgt",
            "title": "Progressive Group Task (PGT)",
            "description": "Individual obstacles followed by group obstacles of increasing difficulty",
            "strategy": "Start with easier obstacles, help others, show leadership in planning",
            "common_mistakes": "Being too aggressive, not helping teammates, giving up easily"
        },
        {
            "id": "hgt", 
            "title": "Half Group Task (HGT)",
            "description": "Half the group solves obstacles with limited resources",
            "strategy": "Quick planning, effective communication, utilize everyone's strengths",
            "common_mistakes": "Poor planning, not involving everyone, time mismanagement"
        },
        {
            "id": "lecturette",
            "title": "Lecturette",
            "description": "3-minute individual presentation on given topic",
            "strategy": "Clear structure: intro-body-conclusion, confident delivery, relevant examples",
            "common_mistakes": "Exceeding time limit, poor structure, lack of confidence"
        },
        {
            "id": "command_task",
            "title": "Command Task", 
            "description": "Individual leads subordinates to complete obstacle",
            "strategy": "Clear instructions, encourage team, adapt plan if needed",
            "common_mistakes": "Unclear communication, not motivating team, inflexible planning"
        }
    ]
    return {"tasks": tasks}

# AI Mentor Chat
@app.post("/api/chat/mentor")
async def chat_with_mentor(data: dict):
    user_message = data.get("message")
    user_id = data.get("user_id", "anonymous")
    
    mentor_prompt = f"""
    You are an experienced SSB mentor and retired military officer who helps candidates prepare for SSB interviews.
    
    User question: "{user_message}"
    
    Provide helpful, motivational advice focusing on:
    - Practical SSB preparation tips
    - Building confidence and officer-like qualities  
    - Addressing specific doubts or concerns
    - Encouraging a positive mindset
    
    Keep response conversational and under 200 words.
    """
    
    ai_response = await get_ai_response(
        "You are a supportive SSB mentor with years of experience helping candidates succeed.",
        mentor_prompt
    )
    
    # Store chat history in database
    chat_data = {
        "user_id": user_id,
        "message": user_message,
        "response": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.chat_history.insert_one(chat_data)
    
    return {"response": ai_response}

# Progress Tracking
@app.get("/api/progress/{user_id}")
async def get_user_progress(user_id: str):
    # Mock progress data - in real app, fetch from database
    progress = {
        "user_id": user_id,
        "practice_streak": 7,
        "total_sessions": 25,
        "average_scores": {
            "OIR": 75,
            "PPDT": 80,
            "TAT": 70,
            "WAT": 85,
            "SRT": 78
        },
        "strengths": ["Leadership", "Problem Solving", "Communication"],
        "areas_for_improvement": ["Time Management", "Stress Handling"],
        "next_recommendations": [
            "Practice more OIR questions on logical reasoning",
            "Work on TAT responses - focus on positive outcomes",
            "Improve interview confidence through mock sessions"
        ]
    }
    return progress

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)