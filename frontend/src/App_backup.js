import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import UI components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Import icons
import { 
  Brain, 
  Image, 
  MessageSquare, 
  Users, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Send,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/practice/oir" element={<OIRPractice />} />
          <Route path="/practice/ppdt" element={<PPDTPractice />} />
          <Route path="/practice/tat" element={<TATPractice />} />
          <Route path="/practice/wat" element={<WATPractice />} />
          <Route path="/practice/srt" element={<SRTPractice />} />
          <Route path="/interview" element={<InterviewSimulator />} />
          <Route path="/gto" element={<GTOGuidance />} />
          <Route path="/quiz/defense" element={<DefenseGKQuiz />} />
          <Route path="/quiz/current-affairs" element={<CurrentAffairsQuiz />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/mentor" element={<MentorChat />} />
        </Routes>
      </div>
    </Router>
  );
}

// Dashboard Component
function Dashboard() {
  const [stats, setStats] = useState({
    practiceStreak: 7,
    totalSessions: 25,
    averageScore: 78
  });

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-slate-800">SSB Preparation Hub</h1>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Master the Services Selection Board process with AI-powered practice and expert guidance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Practice Streak</p>
                <p className="text-3xl font-bold">{stats.practiceStreak} days</p>
              </div>
              <Zap className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Sessions</p>
                <p className="text-3xl font-bold">{stats.totalSessions}</p>
              </div>
              <Target className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{stats.averageScore}%</p>
              </div>
              <Award className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Practice Section */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Daily Practice
            </CardTitle>
            <CardDescription className="text-blue-100">
              Sharpen your skills with AI-powered practice sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <PracticeCard 
                title="OIR Tests"
                description="Reasoning & Intelligence"
                icon={<Brain className="h-8 w-8 text-blue-600" />}
                link="/practice/oir"
              />
              <PracticeCard 
                title="PP&DT"
                description="Picture Perception"
                icon={<Image className="h-8 w-8 text-green-600" />}
                link="/practice/ppdt"
              />
              <PracticeCard 
                title="TAT Practice"
                description="Thematic Tests" 
                icon={<MessageSquare className="h-8 w-8 text-purple-600" />}
                link="/practice/tat"
              />
              <PracticeCard 
                title="WAT & SRT"
                description="Word & Situation Tests"
                icon={<Zap className="h-8 w-8 text-orange-600" />}
                link="/practice/wat"
              />
            </div>
          </CardContent>
        </Card>

        {/* Other Features */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Users className="h-6 w-6 mr-2" />
              Advanced Training
            </CardTitle>
            <CardDescription className="text-emerald-100">
              Comprehensive preparation tools and guidance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <FeatureCard 
                title="Interview Simulator"
                description="AI-powered mock interviews with real-time feedback"
                icon={<MessageSquare className="h-6 w-6 text-blue-600" />}
                link="/interview"
              />
              <FeatureCard 
                title="GTO Task Guidance" 
                description="Interactive guides for group testing activities"
                icon={<Users className="h-6 w-6 text-green-600" />}
                link="/gto"
              />
              <FeatureCard 
                title="Defense GK & Current Affairs"
                description="Stay updated with latest defense knowledge"
                icon={<BookOpen className="h-6 w-6 text-purple-600" />}
                link="/quiz/defense"
              />
              <FeatureCard 
                title="Progress Tracking"
                description="Monitor your improvement with detailed analytics"
                icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                link="/progress"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Mentor Quick Access */}
      <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Mentor Available 24/7</h3>
              <p className="text-slate-600">Get instant guidance, tips, and motivation from our intelligent mentor</p>
            </div>
            <Button 
              onClick={() => window.location.href = '/mentor'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Practice Card Component
function PracticeCard({ title, description, icon, link }) {
  return (
    <Button 
      variant="ghost" 
      className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 border border-gray-200 rounded-lg"
      onClick={() => window.location.href = link}
    >
      {icon}
      <div className="text-center">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </Button>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon, link }) {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start p-4 h-auto hover:bg-emerald-50 border border-gray-200 rounded-lg"
      onClick={() => window.location.href = link}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <div className="text-left">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </Button>
  );
}

// OIR Practice Component
function OIRPractice() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/oir/questions`);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load questions');
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/oir/submit`, {
        answer: selectedAnswer,
        question_id: questions[currentQuestion].id,
        correct_answer: questions[currentQuestion].correct_answer
      });

      setFeedback(response.data);
      if (response.data.correct) {
        setScore(score + 1);
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect answer');
      }
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/'}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">OIR Practice</h1>
        <p className="text-slate-600">Test your reasoning and intelligence skills</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            <Badge variant="outline">Score: {score}/{questions.length}</Badge>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full text-left justify-start p-4"
                  onClick={() => setSelectedAnswer(index)}
                  disabled={feedback !== null}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>
          </div>

          {!feedback && (
            <Button 
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Submit Answer
            </Button>
          )}

          {feedback && (
            <div className="space-y-4">
              <Alert className={feedback.correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{feedback.correct ? "Correct!" : "Incorrect"}</AlertTitle>
                <AlertDescription className="mt-2">
                  <strong>Explanation:</strong> {question.explanation}
                </AlertDescription>
              </Alert>
              
              <Alert className="border-blue-200 bg-blue-50">
                <Brain className="h-4 w-4" />
                <AlertTitle>AI Feedback</AlertTitle>
                <AlertDescription className="mt-2 whitespace-pre-line">
                  {feedback.feedback}
                </AlertDescription>
              </Alert>

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={nextQuestion} className="w-full">
                  Next Question
                </Button>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Practice Complete!</h3>
                  <p className="text-slate-600 mb-4">Final Score: {score}/{questions.length} ({Math.round((score/questions.length)*100)}%)</p>
                  <Button onClick={() => window.location.href = '/'}>
                    Return to Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// PP&DT Practice Component
function PPDTPractice() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [story, setStory] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/ppdt/images`);
      setImages(response.data.images);
      setCurrentImage(response.data.images[0]);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load images');
      setLoading(false);
    }
  };

  const submitStory = async () => {
    if (!story.trim()) {
      toast.error('Please write a story first');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/ppdt/submit`, {
        story: story,
        image_id: currentImage.id
      });

      setFeedback(response.data);
      toast.success('Story submitted for evaluation');
    } catch (error) {
      toast.error('Failed to submit story');
    }
    setSubmitting(false);
  };

  const selectNewImage = () => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setCurrentImage(randomImage);
    setStory('');
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/'}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Picture Perception & Description Test</h1>
        <p className="text-slate-600">Analyze the image and write a compelling story</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Image</span>
              <Button variant="outline" size="sm" onClick={selectNewImage}>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Image
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentImage && (
              <div className="space-y-4">
                <img 
                  src={currentImage.url} 
                  alt="PP&DT Test"
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                />
                <p className="text-sm text-gray-600 italic">{currentImage.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Story Writing Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Write Your Story</CardTitle>
            <CardDescription>
              Create a positive story with clear characters, plot, and outcome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Write your story here... Include who, what, why, and how the situation resolves positively."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="min-h-48 resize-none"
                disabled={feedback !== null}
              />
              
              <div className="text-sm text-gray-600">
                <p>Word count: {story.split(' ').filter(word => word.length > 0).length}</p>
              </div>

              {!feedback && (
                <Button 
                  onClick={submitStory}
                  disabled={submitting || !story.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Story...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for AI Analysis
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-6 w-6 mr-2 text-blue-600" />
              AI Analysis & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-96">
              <div className="whitespace-pre-line text-gray-700">
                {feedback.evaluation}
              </div>
            </ScrollArea>
            
            <div className="mt-6 flex space-x-4">
              <Button onClick={selectNewImage} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Another Image
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Additional components would be implemented similarly...
// For brevity, I'll include placeholders for the remaining components

function TATPractice() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">TAT Practice - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function WATPractice() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">WAT & SRT Practice - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function SRTPractice() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">SRT Practice - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function InterviewSimulator() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Interview Simulator - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function GTOGuidance() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">GTO Task Guidance - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function DefenseGKQuiz() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Defense GK Quiz - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function CurrentAffairsQuiz() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Current Affairs Quiz - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function ProgressTracker() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Progress Tracker - Coming Soon</h1>
      <Button onClick={() => window.location.href = '/'}>← Back to Dashboard</Button>
    </div>
  );
}

function MentorChat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your SSB preparation mentor. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { type: 'user', content: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat/mentor`, {
        message: inputMessage,
        user_id: 'demo_user'
      });

      setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
    } catch (error) {
      toast.error('Failed to get response from mentor');
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.location.href = '/'}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Mentor Chat</h1>
        <p className="text-slate-600">Get personalized guidance for your SSB preparation</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <Separator />
          
          <div className="p-6">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask your mentor anything about SSB preparation..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={loading}
              />
              <Button onClick={sendMessage} disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;