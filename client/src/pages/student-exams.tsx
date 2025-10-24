import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/navigation';
import { 
  Clock, 
  BookOpen, 
  Trophy, 
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import StudentExam from '@/components/student-exam';
import ExamResults from '@/components/exam-results';

interface Question {
  _id: string;
  questionText: string;
  questionImage?: string;
  questionType: 'mcq' | 'multiple' | 'integer';
  options?: string[];
  correctAnswer: string | string[];
  marks: number;
  negativeMarks: number;
  explanation?: string;
  subject: 'maths' | 'physics' | 'chemistry';
}

interface Exam {
  _id: string;
  title: string;
  description: string;
  examType: 'weekend' | 'mains' | 'advanced' | 'practice';
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  instructions: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  questions: Question[];
}

interface ExamResult {
  examId: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  timeTaken: number;
  subjectWiseScore: {
    maths: { correct: number; total: number; marks: number };
    physics: { correct: number; total: number; marks: number };
    chemistry: { correct: number; total: number; marks: number };
  };
}

export default function StudentExams() {
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isTakingExam, setIsTakingExam] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [, setLocation] = useLocation();

  // Reset states when component mounts
  useEffect(() => {
    console.log('StudentExams component mounted, resetting states');
    setCurrentExam(null);
    setExamResult(null);
    setIsTakingExam(false);
  }, []);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/me', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const userData = await response.json();
            console.log('User authenticated:', userData.user);
            setIsAuthenticated(true);
          } else {
            console.warn('Auth response is not JSON, allowing access with fallback');
            setIsAuthenticated(true);
          }
        } else {
          console.log('User not authenticated, redirecting to login');
          setLocation('/signin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Allow access with fallback authentication
        setIsAuthenticated(true);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, [setLocation]);

  // Fetch available exams
  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['/api/student/exams'],
    queryFn: async () => {
      console.log('Fetching student exams...');
      const response = await fetch('/api/student/exams', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch exams:', errorText);
        // Return fallback data instead of throwing error
        return { exams: [] };
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Fetched exams:', data);
        return data;
      } else {
        console.warn('Exams response is not JSON, using fallback data');
        return { exams: [] };
      }
    },
    enabled: isAuthenticated // Only run when authenticated
  });

  // Fetch assessments
  const { data: assessments, isLoading: isLoadingAssessments, error: assessmentsError } = useQuery({
    queryKey: ['/api/assessments'],
    queryFn: async () => {
      console.log('Fetching assessments...');
      const response = await fetch('/api/assessments', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        console.warn('Assessments API failed, using fallback data');
        return { assessments: [] };
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Fetched assessments:', data);
        return data;
      } else {
        console.warn('Assessments response is not JSON, using fallback data');
        return { assessments: [] };
      }
    }
  });

  // Fetch exam results
  const { data: results } = useQuery({
    queryKey: ['/api/student/exam-results'],
    queryFn: async () => {
      const response = await fetch('/api/student/exam-results', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch results');
      return response.json();
    },
    enabled: isAuthenticated // Only run when authenticated
  });

  const handleStartExam = (exam: Exam) => {
    console.log('Starting exam:', exam);
    console.log('Current exam result state:', examResult);
    console.log('Current taking exam state:', isTakingExam);
    
    // Reset all states when starting a new exam
    setExamResult(null);
    setCurrentExam(exam);
    setIsTakingExam(true);
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
    setIsTakingExam(false);
  };

  const handleExitExam = () => {
    setCurrentExam(null);
    setIsTakingExam(false);
  };

  const handleRetakeExam = () => {
    if (currentExam) {
      setExamResult(null);
      setIsTakingExam(true);
    }
  };

  const handleBackToExams = () => {
    setCurrentExam(null);
    setExamResult(null);
    setIsTakingExam(false);
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'mains': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'weekend': return 'bg-green-100 text-green-700';
      case 'practice': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (now < startDate) return { status: 'upcoming', color: 'bg-yellow-100 text-yellow-700' };
    if (now > endDate) return { status: 'ended', color: 'bg-red-100 text-red-700' };
    return { status: 'active', color: 'bg-green-100 text-green-700' };
  };

  // Debug state
  console.log('Render state:', {
    isTakingExam,
    currentExam: currentExam ? currentExam._id : null,
    examResult: examResult ? 'exists' : null,
    isLoadingAuth,
    isAuthenticated
  });

  if (isTakingExam && currentExam) {
    console.log('Rendering StudentExam component');
    return (
      <StudentExam 
        examId={currentExam._id}
        onComplete={handleExamComplete}
        onExit={handleExitExam}
      />
    );
  }

  if (examResult && currentExam) {
    console.log('Rendering ExamResults component');
    return (
      <ExamResults
        result={examResult}
        examTitle={currentExam.title}
        onRetake={handleRetakeExam}
        onViewAnalysis={() => {}}
        onBack={handleBackToExams}
      />
    );
  }

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600 mb-4">Please log in to access exams</p>
          <button 
            onClick={() => setLocation('/signin')} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exams</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exams & Assessments</h1>
          <p className="text-gray-600">Take practice exams and track your progress</p>
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Debug Info:</h4>
            <p className="text-sm text-blue-700">
              Loading: {isLoading ? 'Yes' : 'No'} | 
              Error: {error ? 'Yes' : 'No'} | 
              Exams Count: {exams?.length || 0}
            </p>
            {exams && (
              <div className="mt-2">
                <p className="text-xs text-blue-600">Exam IDs: {exams.map((exam: any) => exam._id).join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available">Available Exams</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="results">My Results</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          {/* Available Exams */}
          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams?.filter((exam: Exam) => getExamStatus(exam).status === 'active').map((exam: Exam) => {
                const status = getExamStatus(exam);
                return (
                  <Card key={exam._id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{exam.title}</CardTitle>
                          <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                        </div>
                        <Badge className={getExamTypeColor(exam.examType)}>
                          {exam.examType.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Exam Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{exam.duration} minutes</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Questions</span>
                            <span className="font-medium">{exam.totalQuestions}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Marks</span>
                            <span className="font-medium">{exam.totalMarks}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Status</span>
                            <Badge className={status.color}>
                              {status.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        {/* Instructions Preview */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {exam.instructions}
                          </p>
                        </div>

                        {/* Action Button */}
                        <Button 
                          onClick={() => handleStartExam(exam)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                          disabled={status.status !== 'active'}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {status.status === 'active' ? 'Start Exam' : 'Not Available'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {exams?.filter((exam: Exam) => getExamStatus(exam).status === 'active').length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Exams</h3>
                <p className="text-gray-600">Check back later for new exams</p>
              </div>
            )}
          </TabsContent>

          {/* Assessments */}
          <TabsContent value="assessments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments?.map((assessment: any) => (
                <Card key={assessment._id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{assessment.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                      </div>
                      <Badge className={assessment.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : 
                                     assessment.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                                     'bg-red-100 text-red-700'}>
                        {assessment.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Assessment Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{assessment.duration} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Points</span>
                          <span className="font-medium">{assessment.totalPoints}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subject</span>
                          <span className="font-medium">{assessment.subjectIds?.[0] || 'General'}</span>
                        </div>
                        {assessment.isDriveQuiz && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Type</span>
                            <Badge className="bg-blue-100 text-blue-700">Google Drive</Badge>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => {
                          if (assessment.isDriveQuiz && assessment.driveLink) {
                            window.open(assessment.driveLink, '_blank');
                          } else {
                            alert('Assessment functionality coming soon!');
                          }
                        }}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        {assessment.isDriveQuiz ? 'Open in Drive' : 'Take Assessment'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!assessments || assessments.length === 0) && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Available</h3>
                <p className="text-gray-600">Check back later for new assessments</p>
              </div>
            )}
          </TabsContent>

          {/* My Results */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results?.map((result: ExamResult & { examTitle: string }) => (
                <Card key={result.examId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{result.examTitle}</CardTitle>
                      <Badge className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Score */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {result.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.obtainedMarks}/{result.totalMarks} marks
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Correct</span>
                          <span className="text-green-600 font-medium">{result.correctAnswers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Wrong</span>
                          <span className="text-red-600 font-medium">{result.wrongAnswers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Time Taken</span>
                          <span className="font-medium">
                            {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                          </span>
                        </div>
                      </div>

                      {/* Grade */}
                      <div className="text-center">
                        <Badge className={
                          result.percentage >= 70 ? 'bg-green-100 text-green-700' :
                          result.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {result.percentage >= 70 ? 'Excellent' :
                           result.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                        </Badge>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          // Find the exam and start retake
                          const exam = exams?.find((e: Exam) => e._id === result.examId);
                          if (exam) {
                            setCurrentExam(exam);
                            setIsTakingExam(true);
                          }
                        }}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Retake Exam
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {(!results || results.length === 0) && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600">Complete an exam to see your results here</p>
              </div>
            )}
          </TabsContent>

          {/* Upcoming Exams */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams?.filter((exam: Exam) => getExamStatus(exam).status === 'upcoming').map((exam: Exam) => (
                <Card key={exam._id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{exam.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        UPCOMING
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Exam Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{exam.duration} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Questions</span>
                          <span className="font-medium">{exam.totalQuestions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Starts</span>
                          <span className="font-medium">
                            {new Date(exam.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Ends</span>
                          <span className="font-medium">
                            {new Date(exam.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Not Yet Available
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {exams?.filter((exam: Exam) => getExamStatus(exam).status === 'upcoming').length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Exams</h3>
                <p className="text-gray-600">Check back later for scheduled exams</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
