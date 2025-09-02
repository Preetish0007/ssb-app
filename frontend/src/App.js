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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Label } from './components/ui/label';
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
  Zap,
  Phone,
  Key,
  LogIn,
  LogOut,
  User,
  FileText,
  Mic,
  Calendar,
  BarChart3
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Auth Context
const AuthContext = React.createContext();

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('ssb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ssb_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ssb_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/practice/oir" element={user ? <OIRPractice /> : <Navigate to="/login" />} />
            <Route path="/practice/ppdt" element={user ? <PPDTPractice /> : <Navigate to="/login" />} />
            <Route path="/practice/tat" element={user ? <TATPractice /> : <Navigate to="/login" />} />
            <Route path="/practice/wat" element={user ? <WATPractice /> : <Navigate to="/login" />} />
            <Route path="/practice/srt" element={user ? <SRTPractice /> : <Navigate to="/login" />} />
            <Route path="/interview" element={user ? <InterviewSimulator /> : <Navigate to="/login" />} />
            <Route path="/gto" element={user ? <GTOGuidance /> : <Navigate to="/login" />} />
            <Route path="/quiz/defense" element={user ? <DefenseGKQuiz /> : <Navigate to="/login" />} />
            <Route path="/quiz/current-affairs" element={user ? <CurrentAffairsQuiz /> : <Navigate to="/login" />} />
            <Route path="/progress" element={user ? <ProgressTracker /> : <Navigate to="/login" />} />
            <Route path="/mentor" element={user ? <MentorChat /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

// Login Page Component
function LoginPage() {
  const { login } = React.useContext(AuthContext);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Mock OTP sending - in real app, this would call backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      toast.success('OTP sent to your phone number');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      // Mock OTP verification - accept any 4+ digit OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 'user_' + Date.now(),
        phone: phoneNumber,
        name: 'SSB Candidate',
        loginTime: new Date().toISOString()
      };
      
      login(userData);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-800">SSB Prep Login</h1>
          </div>
          <CardDescription>
            {step === 'phone' ? 'Enter your phone number to get started' : 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                    maxLength={10}
                  />
                </div>
              </div>
              
              <Button 
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 4-6 digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              
              <Button 
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Verify & Login
                  </>
                )}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Header Component
function Header() {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-xl font-bold text-slate-800">SSB Preparation Hub</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {user?.phone}
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
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
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back, Future Officer!</h2>
          <p className="text-lg text-slate-600">Master the Services Selection Board process with AI-powered practice</p>
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

// Enhanced PP&DT Practice Component with 5 questions
function PPDTPractice() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [story, setStory] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  
  // PP&DT Pre-story questions
  const [ppdtData, setPpdtData] = useState({
    background: '',
    numCharacters: '',
    gender: '',
    mood: '',
    age: ''
  });

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

  const handleQuestionSubmit = () => {
    if (!ppdtData.background || !ppdtData.numCharacters || !ppdtData.gender || !ppdtData.mood || !ppdtData.age) {
      toast.error('Please answer all questions before proceeding');
      return;
    }
    setShowQuestions(false);
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
        image_id: currentImage.id,
        background: ppdtData.background,
        numCharacters: ppdtData.numCharacters,
        gender: ppdtData.gender,
        mood: ppdtData.mood,
        age: ppdtData.age
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
    setShowQuestions(true);
    setPpdtData({
      background: '',
      numCharacters: '',
      gender: '',
      mood: '',
      age: ''
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
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
          <p className="text-slate-600">Analyze the black & white hazy image and write a compelling story</p>
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
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 filter grayscale"
                  />
                  <p className="text-sm text-gray-600 italic">{currentImage.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions or Story Writing Section */}
          <Card className="shadow-lg">
            {showQuestions ? (
              <>
                <CardHeader>
                  <CardTitle>Pre-Story Questions</CardTitle>
                  <CardDescription>
                    Answer these questions before writing your story
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="background">1. Background Detail</Label>
                      <Select value={ppdtData.background} onValueChange={(value) => setPpdtData({...ppdtData, background: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select background type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rural">Rural</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="numCharacters">2. Number of Characters</Label>
                      <Input
                        type="number"
                        placeholder="Enter number (e.g., 2)"
                        value={ppdtData.numCharacters}
                        onChange={(e) => setPpdtData({...ppdtData, numCharacters: e.target.value})}
                        min="1"
                        max="10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">3. Gender of Characters</Label>
                      <Select value={ppdtData.gender} onValueChange={(value) => setPpdtData({...ppdtData, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male (M)</SelectItem>
                          <SelectItem value="F">Female (F)</SelectItem>
                          <SelectItem value="P">Both/Mixed (P)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="mood">4. Mood of Characters</Label>
                      <Select value={ppdtData.mood} onValueChange={(value) => setPpdtData({...ppdtData, mood: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mood" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+">Positive (+)</SelectItem>
                          <SelectItem value="-">Negative (-)</SelectItem>
                          <SelectItem value="0">Neutral (0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="age">5. Age of Characters</Label>
                      <Input
                        type="number"
                        placeholder="Enter age (e.g., 25)"
                        value={ppdtData.age}
                        onChange={(e) => setPpdtData({...ppdtData, age: e.target.value})}
                        min="5"
                        max="80"
                      />
                    </div>

                    <Button 
                      onClick={handleQuestionSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Proceed to Story Writing
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Write Your Story</CardTitle>
                  <CardDescription>
                    Create a positive story based on your answers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                      <p><strong>Your Settings:</strong></p>
                      <p>Background: {ppdtData.background} | Characters: {ppdtData.numCharacters} ({ppdtData.gender}) | Mood: {ppdtData.mood} | Age: {ppdtData.age}</p>
                    </div>

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
              </>
            )}
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
    </div>
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
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div>
      <Header />
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
    </div>
  );
}

// TAT Practice Component
function TATPractice() {
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/tat/scenarios`);
      setScenarios(response.data.scenarios);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load scenarios');
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!response.trim()) {
      toast.error('Please write a response first');
      return;
    }

    setSubmitting(true);
    try {
      const result = await axios.post(`${BACKEND_URL}/api/tat/submit`, {
        response: response,
        scenario_id: scenarios[currentScenario].id
      });

      setFeedback(result.data);
      toast.success('Response submitted for evaluation');
    } catch (error) {
      toast.error('Failed to submit response');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">TAT Practice</h1>
          <p className="text-slate-600">Thematic Apperception Test - Write your response</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scenario {currentScenario + 1} of {scenarios.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-lg">{scenarios[currentScenario]?.scenario}</p>
              </div>
              
              <Textarea
                placeholder="Write your response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-48"
                disabled={feedback !== null}
              />
              
              {!feedback && (
                <Button 
                  onClick={submitResponse}
                  disabled={submitting || !response.trim()}
                  className="w-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Response'}
                </Button>
              )}
              
              {feedback && (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>AI Feedback</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-line">
                    {feedback.feedback}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// WAT Practice Component
function WATPractice() {
  const [words, setWords] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/wat/words`);
      setWords(response.data.words);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load words');
      setLoading(false);
    }
  };

  const submitResponses = async () => {
    const responseArray = words.map(word => ({
      word: word,
      response: responses[word] || ''
    }));

    try {
      const result = await axios.post(`${BACKEND_URL}/api/wat/submit`, {
        responses: responseArray
      });

      setFeedback(result.data);
      toast.success('Responses submitted for evaluation');
    } catch (error) {
      toast.error('Failed to submit responses');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">WAT Practice</h1>
          <p className="text-slate-600">Word Association Test - Write your first thoughts</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {words.map((word, index) => (
                <div key={index} className="space-y-2">
                  <Label>{word}</Label>
                  <Input
                    placeholder="Your association..."
                    value={responses[word] || ''}
                    onChange={(e) => setResponses({...responses, [word]: e.target.value})}
                    disabled={feedback !== null}
                  />
                </div>
              ))}
            </div>
            
            {!feedback && (
              <Button 
                onClick={submitResponses}
                className="w-full mt-6"
              >
                Submit All Responses
              </Button>
            )}
            
            {feedback && (
              <Alert className="mt-6">
                <Brain className="h-4 w-4" />
                <AlertTitle>AI Analysis</AlertTitle>
                <AlertDescription className="mt-2 whitespace-pre-line">
                  {feedback.feedback}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// SRT Practice Component
function SRTPractice() {
  const [situations, setSituations] = useState([]);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSituations();
  }, []);

  const fetchSituations = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/srt/situations`);
      setSituations(response.data.situations);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load situations');
      setLoading(false);
    }
  };

  const submitResponses = async () => {
    const responseArray = situations.map(situation => ({
      situation_id: situation.id,
      response: responses[situation.id] || ''
    }));

    try {
      const result = await axios.post(`${BACKEND_URL}/api/srt/submit`, {
        responses: responseArray
      });

      setFeedback(result.data);
      toast.success('Responses submitted for evaluation');
    } catch (error) {
      toast.error('Failed to submit responses');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">SRT Practice</h1>
          <p className="text-slate-600">Situation Reaction Test - Quick decision making</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {situations.map((situation, index) => (
                <div key={situation.id} className="space-y-2">
                  <Label className="text-base font-medium">Situation {index + 1}</Label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>{situation.situation}</p>
                  </div>
                  <Textarea
                    placeholder="Your reaction..."
                    value={responses[situation.id] || ''}
                    onChange={(e) => setResponses({...responses, [situation.id]: e.target.value})}
                    disabled={feedback !== null}
                    className="min-h-24"
                  />
                </div>
              ))}
            </div>
            
            {!feedback && (
              <Button 
                onClick={submitResponses}
                className="w-full mt-6"
              >
                Submit All Responses
              </Button>
            )}
            
            {feedback && (
              <Alert className="mt-6">
                <Brain className="h-4 w-4" />
                <AlertTitle>AI Analysis</AlertTitle>
                <AlertDescription className="mt-2 whitespace-pre-line">
                  {feedback.feedback}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Interview Simulator Component
function InterviewSimulator() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startInterview();
  }, []);

  const startInterview = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/interview/start`);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to start interview');
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      const result = await axios.post(`${BACKEND_URL}/api/interview/submit`, {
        question: questions[currentQuestion],
        answer: answer
      });

      setFeedback(result.data);
      toast.success('Answer submitted');
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview Simulator</h1>
          <p className="text-slate-600">Practice with AI-powered mock interviews</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-lg font-medium">{questions[currentQuestion]}</p>
              </div>
              
              <Textarea
                placeholder="Your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-32"
                disabled={feedback !== null}
              />
              
              {!feedback && (
                <Button 
                  onClick={submitAnswer}
                  disabled={!answer.trim()}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              )}
              
              {feedback && (
                <Alert>
                  <Mic className="h-4 w-4" />
                  <AlertTitle>Interview Feedback</AlertTitle>
                  <AlertDescription className="mt-2 whitespace-pre-line">
                    {feedback.feedback}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// GTO Guidance Component
function GTOGuidance() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/gto/tasks`);
      setTasks(response.data.tasks);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load GTO tasks');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">GTO Task Guidance</h1>
          <p className="text-slate-600">Learn strategies for Group Testing Officer tasks</p>
        </div>

        <div className="space-y-6">
          {tasks.map((task, index) => (
            <Card key={task.id} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600" />
                  {task.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Description:</h4>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-800">Strategy:</h4>
                    <p className="text-green-700">{task.strategy}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-800">Common Mistakes:</h4>
                    <p className="text-red-700">{task.common_mistakes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Defense GK Quiz Component
function DefenseGKQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/defense-gk/quiz`);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz questions');
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
      toast.success('Correct!');
    } else {
      toast.error('Incorrect');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Card className="shadow-lg text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-4">Your Score: {score}/{questions.length}</p>
              <p className="text-lg mb-6">Percentage: {Math.round((score/questions.length)*100)}%</p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Defense GK Quiz</h1>
          <p className="text-slate-600">Test your defense knowledge</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            <Progress value={(currentQuestion / questions.length) * 100} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{question.question}</h3>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </div>
              
              <Button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Current Affairs Quiz Component
function CurrentAffairsQuiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/current-affairs/quiz`);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz questions');
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
      toast.success('Correct!');
    } else {
      toast.error('Incorrect');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <Card className="shadow-lg text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
              <p className="text-xl mb-4">Your Score: {score}/{questions.length}</p>
              <p className="text-lg mb-6">Percentage: {Math.round((score/questions.length)*100)}%</p>
              <Button onClick={() => window.location.href = '/'}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Current Affairs Quiz</h1>
          <p className="text-slate-600">Stay updated with latest affairs</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
            <Progress value={(currentQuestion / questions.length) * 100} />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{question.question}</h3>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full text-left justify-start"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
              </div>
              
              <Button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Progress Tracker Component
function ProgressTracker() {
  const { user } = React.useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/progress/${user?.id || 'demo'}`);
      setProgress(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load progress data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Progress Tracker</h1>
          <p className="text-slate-600">Monitor your SSB preparation journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-600" />
                Practice Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{progress?.practice_streak} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{progress?.total_sessions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Average Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress?.average_scores && Object.entries(progress.average_scores).map(([test, score]) => (
                  <div key={test} className="flex justify-between">
                    <span>{test}:</span>
                    <span className="font-semibold">{score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress?.strengths?.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress?.areas_for_improvement?.map((area, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {progress?.next_recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-600" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced Mentor Chat Component with bullet points
function MentorChat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Hello! I'm your SSB preparation mentor. How can I help you today?

Here's what I can assist you with:
• SSB interview preparation strategies
• Practice test guidance and tips
• Building confidence and leadership qualities
• Addressing specific doubts or concerns
• Motivation and encouragement`
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

      // Format the response in bullet points for easier reading
      let formattedResponse = response.data.response;
      
      // If response doesn't already have bullet points, try to format it
      if (!formattedResponse.includes('•') && !formattedResponse.includes('-')) {
        const sentences = formattedResponse.split('. ');
        if (sentences.length > 2) {
          formattedResponse = sentences.map((sentence, index) => 
            index === 0 ? sentence + ':\n' : `• ${sentence}${sentence.endsWith('.') ? '' : '.'}`
          ).join('\n');
        }
      }

      setMessages(prev => [...prev, { type: 'bot', content: formattedResponse }]);
    } catch (error) {
      toast.error('Failed to get response from mentor');
    }

    setLoading(false);
  };

  return (
    <div>
      <Header />
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
                      <div className="whitespace-pre-line">{message.content}</div>
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
    </div>
  );
}

export default App;