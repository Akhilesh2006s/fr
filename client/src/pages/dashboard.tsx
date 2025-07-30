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
  Award
} from "lucide-react";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user-1";

export default function Dashboard() {
  const isMobile = useIsMobile();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ID, "dashboard"],
  });

  if (isLoading) {
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
  const user = (dashboardData as any)?.user || { fullName: "Student", age: 18, educationStream: "JEE" };
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
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isMobile ? 'pb-20' : ''}`}>
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.fullName.split(' ')[0]}!
              </h1>
              <p className="text-blue-100 mb-6">
                Ready to continue your {user.educationStream} preparation journey? Your AI tutor has personalized recommendations waiting.
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    {user.educationStream} 2024
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
                    <div key={video.id} className="video-thumbnail">
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

            {/* Practice Tests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Practice Tests & Assessments</CardTitle>
                  <Link href="/tests">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableTests.slice(0, 2).map((test: any) => (
                  <div key={test.id} className="test-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{test.title}</h3>
                          <p className="text-sm text-gray-600">
                            {test.totalQuestions} Questions • {Math.floor(test.duration / 3600)} Hours • {test.subjectIds?.length} Subjects
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge className="text-xs">New</Badge>
                            <span className="text-xs text-gray-500">Attempted by 24,567 students</span>
                          </div>
                        </div>
                      </div>
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        Start Test
                      </Button>
                    </div>
                  </div>
                ))}

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
    </>
  );
}
