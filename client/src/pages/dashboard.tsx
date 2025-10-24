import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/navigation";
import AIChat from "@/components/ai-chat";
import ProgressChart from "@/components/progress-chart";
import { 
  Flame, 
  CheckCircle, 
  TrendingUp, 
  BarChart3, 
  Play, 
  FileText, 
  Zap,
  Calendar,
  Download,
  Users,
  Star,
  Clock,
  Award,
  Target
} from "lucide-react";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import YouTubePlayer from '@/components/youtube-player';
import DriveViewer from '@/components/drive-viewer';
import VideoModal from '@/components/video-modal';

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user-1";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('No auth token found');
          setUser({ 
            fullName: "Student", 
            email: "student@example.com", 
            age: 18, 
            educationStream: "JEE" 
          });
          return;
        }

        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log('Dashboard auth check - user data:', userData);
          setUser(userData.user);
        } else {
          console.log('Dashboard auth check failed with status:', response.status);
          // Fallback to mock data if not authenticated
          setUser({ 
            fullName: "Student", 
            email: "student@example.com", 
            age: 18, 
            educationStream: "JEE" 
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Fallback to mock data
        setUser({ 
          fullName: "Student", 
          email: "student@example.com", 
          age: 18, 
          educationStream: "JEE" 
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videosRes, assessmentsRes] = await Promise.all([
          fetch('/api/student/videos'),
          fetch('/api/student/assessments')
        ]);

        if (videosRes.ok) {
          const videosData = await videosRes.json();
          setVideos(videosData.slice(0, 3)); // Show first 3 videos
        }

        if (assessmentsRes.ok) {
          const assessmentsData = await assessmentsRes.json();
          console.log('Dashboard fetched assessments:', assessmentsData);
          console.log('Number of assessments:', assessmentsData.length);
          setAssessments(assessmentsData.slice(0, 3)); // Show first 3 assessments
          setAssessmentsLoading(false);
        } else {
          console.error('Failed to fetch assessments:', assessmentsRes.status);
          setAssessmentsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        // Set mock data for development
        setVideos([
          {
            id: '1',
            title: 'Calculus Fundamentals',
            description: 'Basic calculus concepts',
            subject: 'Mathematics',
            duration: 45,
            youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isYouTubeVideo: true,
            isActive: true
          },
          {
            id: '2',
            title: 'Physics Mechanics',
            description: 'Introduction to mechanics',
            subject: 'Physics',
            duration: 60,
            videoUrl: 'https://example.com/video.mp4',
            isYouTubeVideo: false,
            isActive: true
          }
        ]);
        setAssessments([
          {
            id: '1',
            title: 'Mathematics Quiz',
            description: 'Basic math concepts',
            subject: 'Mathematics',
            type: 'quiz',
            difficulty: 'easy',
            duration: 30,
            totalMarks: 100,
            passingMarks: 50,
            isDriveQuiz: true,
            driveLink: 'https://drive.google.com/file/d/1ABC123/view',
            isActive: true
          },
          {
            id: '2',
            title: 'Physics Exam',
            description: 'Physics midterm exam',
            subject: 'Physics',
            type: 'exam',
            difficulty: 'medium',
            duration: 120,
            totalMarks: 150,
            passingMarks: 90,
            isDriveQuiz: false,
            isActive: true
          }
        ]);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchContent();
  }, []);

  const handleWatchVideo = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ID, "dashboard"],
  });

  if (isLoading || isLoadingUser || isLoadingContent) {
    return (
      <>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  const stats = (dashboardData as any)?.stats || { streak: 0, questionsAnswered: 0, accuracyRate: 0, rank: 0 };
  const recommendedVideos = (dashboardData as any)?.recommendedVideos || [];
  const availableTests = (dashboardData as any)?.availableTests || [];

  const subjectProgress = [
    { id: "1", name: "Physics", progress: 75, trend: "up" as const, currentTopic: "Mechanics - Rotational Motion", color: "bg-blue-100 text-blue-600" },
    { id: "2", name: "Chemistry", progress: 62, trend: "up" as const, currentTopic: "Organic - Alcohols & Ethers", color: "bg-green-100 text-green-600" },
    { id: "3", name: "Mathematics", progress: 58, trend: "neutral" as const, currentTopic: "Calculus - Integration", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <>
      <Navigation />
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 bg-gray-50 min-h-screen ${isMobile ? 'pb-20' : ''}`}>
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.email || 'Student'}!
              </h1>
              <p className="text-blue-100 mb-6">
                Ready to continue your {user?.educationStream || 'JEE'} preparation journey? Your AI tutor has personalized recommendations waiting.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-primary hover:bg-blue-50">
                  Continue Learning
                </Button>
                <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Ask AI Tutor
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M47.1,-78.5C58.9,-69.2,64.3,-50.4,73.2,-32.8C82.1,-15.1,94.5,1.4,94.4,17.9C94.3,34.4,81.7,50.9,66.3,63.2C50.9,75.5,32.7,83.6,13.8,87.1C-5.1,90.6,-24.7,89.5,-41.6,82.1C-58.5,74.7,-72.7,61,-79.8,44.8C-86.9,28.6,-86.9,9.9,-83.2,-6.8C-79.5,-23.5,-72.1,-38.2,-61.3,-49.6C-50.5,-61,-36.3,-69.1,-21.4,-75.8C-6.5,-82.5,9.1,-87.8,25.2,-84.9C41.3,-82,57.9,-70,47.1,-78.5Z" transform="translate(100 100)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Questions Solved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.questionsAnswered.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Accuracy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accuracyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rank</p>
                <p className="text-2xl font-bold text-gray-900">#{stats.rank}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">

          {/* Videos Section */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Video Lectures</CardTitle>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {videos.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <div key={video.id} className={`flex items-center justify-between p-3 ${index % 2 === 0 ? 'bg-purple-50' : 'bg-orange-50'} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-purple-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
                        {video.isYouTubeVideo ? (
                          <Play className={`w-4 h-4 ${index % 2 === 0 ? 'text-purple-600' : 'text-orange-600'}`} />
                        ) : (
                          <Play className={`w-4 h-4 ${index % 2 === 0 ? 'text-purple-600' : 'text-orange-600'}`} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <p className="text-xs text-gray-500">{video.duration} min • {video.subject}</p>
                        {video.isYouTubeVideo && (
                          <span className="text-xs text-red-600">YouTube</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={`${index % 2 === 0 ? 'text-purple-600 border-purple-200' : 'text-orange-600 border-orange-200'}`}
                      onClick={() => handleWatchVideo(video)}
                    >
                      Watch
                    </Button>
                  </div>
                ))}
                {videos.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No videos available</p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Link to="/video-lectures">
                  <Button variant="outline" className="w-full">
                    View All Videos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Section */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Assessments</CardTitle>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {assessments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assessments.map((assessment, index) => (
                  <div key={assessment._id || assessment.id} className={`flex items-center justify-between p-3 ${index % 2 === 0 ? 'bg-red-50' : 'bg-indigo-50'} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-red-100' : 'bg-indigo-100'} rounded-full flex items-center justify-center`}>
                        <Target className={`w-4 h-4 ${index % 2 === 0 ? 'text-red-600' : 'text-indigo-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assessment.title}</p>
                        <p className="text-xs text-gray-500">{assessment.duration} min • {assessment.totalPoints} points</p>
                        {assessment.isDriveQuiz && (
                          <span className="text-xs text-blue-600">Google Drive</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className={`${index % 2 === 0 ? 'text-red-600 border-red-200' : 'text-indigo-600 border-indigo-200'}`}>
                      Take
                    </Button>
                  </div>
                ))}
                {assessmentsLoading ? (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading assessments...</p>
                  </div>
                ) : assessments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No assessments available</p>
                    <p className="text-xs text-gray-400 mt-1">Debug: {assessments.length} assessments loaded</p>
                  </div>
                ) : null}
              </div>
              <div className="mt-4">
                <Link to="/student-exams">
                  <Button variant="outline" className="w-full">
                    View All Assessments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Learning Path & Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI-Powered Learning Path */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your AI-Powered Learning Path</CardTitle>
                  <Badge className="gradient-primary text-white">
                    {user?.educationStream || 'JEE'} 2024
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium text-primary">68%</span>
                  </div>
                  <Progress value={68} className="h-3" />
                </div>

                {/* Subject Progress */}
                <div className="space-y-4">
                  {subjectProgress.map((subject) => (
                    <div key={subject.id} className="subject-progress-card">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject.color}`}>
                          <span className="text-sm font-medium">
                            {subject.name.substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{subject.name}</h3>
                          <p className="text-sm text-gray-600">{subject.currentTopic}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{subject.progress}%</p>
                        <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-primary h-1 rounded-full" 
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full gradient-primary text-white">
                  View Complete Learning Path
                </Button>
              </CardContent>
            </Card>

            {/* Smart Video Lectures */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recommended Video Lectures</CardTitle>
                  <Link href="/videos">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedVideos.slice(0, 2).map((video: any) => (
                    <div key={video.id} className="video-thumbnail group">
                      <img 
                        src={video.thumbnailUrl || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"} 
                        alt={video.title}
                        className="w-full h-32 object-cover rounded-lg" 
                      />
                      <div className="video-overlay">
                        <div className="play-button">
                          <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-sm font-medium">{video.title}</p>
                        <p className="text-white/80 text-xs">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} • {video.subjectId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">AI-Enhanced Features</h4>
                      <p className="text-sm text-gray-600 mt-1">Auto-generated notes, visual memory maps, and voice Q&A available for all lectures</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekend Exams */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Weekend Exams & JEE Tests</CardTitle>
                  <Link href="/student-exams">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* JEE Main Practice Test */}
                <div className="test-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">JEE Main Practice Test</h3>
                        <p className="text-sm text-gray-600">
                          90 Questions • 3 Hours • Maths, Physics, Chemistry
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className="text-xs bg-blue-100 text-blue-700">MAINS</Badge>
                          <span className="text-xs text-gray-500">+4/-1 Marking</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/student-exams">
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        Start Test
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* JEE Advanced Practice Test */}
                <div className="test-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">JEE Advanced Practice Test</h3>
                        <p className="text-sm text-gray-600">
                          54 Questions • 3 Hours • Maths, Physics, Chemistry
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge className="text-xs bg-purple-100 text-purple-700">ADVANCED</Badge>
                          <span className="text-xs text-gray-500">+3/-1 Marking</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/student-exams">
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        Start Test
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Daily Quiz */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Daily Quick Quiz</h4>
                        <p className="text-sm text-gray-600">5 Questions • Earn 50 XP • Current Streak: {stats.streak} days</p>
                      </div>
                    </div>
                    <Button className="gradient-accent text-white">
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Tutor & Performance */}
          <div className="space-y-6">
            
            {/* AI Chat */}
            <AIChat 
              userId={MOCK_USER_ID}
              context={{
                currentSubject: "Physics",
                currentTopic: "Rotational Motion"
              }}
            />

            {/* Performance Dashboard */}
            <ProgressChart 
              subjects={subjectProgress}
              overallProgress={68}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button className="quick-action-button">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Practice Weak Topics</p>
                  </button>

                  <button className="quick-action-button">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Schedule Study</p>
                  </button>

                  <button className="quick-action-button">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                      <Download className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Download Notes</p>
                  </button>

                  <button className="quick-action-button">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Study Groups</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="achievement-card">
                  <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Study Streak Master</p>
                    <p className="text-xs text-gray-600">{stats.streak} days continuous learning</p>
                  </div>
                </div>

                <div className="achievement-card">
                  <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quiz Champion</p>
                    <p className="text-xs text-gray-600">90% accuracy in daily quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        video={selectedVideo}
      />
    </>
  );
}
