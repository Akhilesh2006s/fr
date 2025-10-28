import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Play, 
  Target, 
  TrendingUp,
  Calendar,
  Clock,
  Star,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  Wrench,
  FileText,
  ClipboardList,
  CalendarDays,
  LogOut
} from 'lucide-react';

interface TeacherStats {
  totalStudents: number;
  totalClasses: number;
  totalVideos: number;
  totalAssessments: number;
  averagePerformance: number;
  recentActivity: any[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  classNumber: string;
  performance: number;
  lastExamScore: number;
  totalExams: number;
}

interface Video {
  id: string;
  title: string;
  subject: string;
  duration: string;
  views: number;
  createdAt: string;
}

interface Assessment {
  id: string;
  title: string;
  subject: string;
  questions: number;
  attempts: number;
  averageScore: number;
  createdAt: string;
}

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalVideos: 0,
    totalAssessments: 0,
    averagePerformance: 0,
    recentActivity: []
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setLocation('/auth/login');
  };

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://asli-stud-back-production.up.railway.app/api/teacher/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        setStudents(data.students || []);
        setVideos(data.videos || []);
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20 min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Asli Prep</h1>
                <p className="text-sm text-gray-600">Teacher Portal</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'overview' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'content' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'content' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('content')}
              >
                <BookOpen className="w-4 h-4 mr-3" />
                Content Management
              </Button>
              <Button
                variant={activeTab === 'ai-tools' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'ai-tools' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('ai-tools')}
              >
                <Sparkles className="w-4 h-4 mr-3" />
                AI Tools
              </Button>
              <Button
                variant={activeTab === 'classes' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'classes' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('classes')}
              >
                <Users className="w-4 h-4 mr-3" />
                My Classes
              </Button>
              <Button
                variant={activeTab === 'students' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'students' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('students')}
              >
                <Users className="w-4 h-4 mr-3" />
                Students
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeTab === 'analytics' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Analytics
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome back, Teacher!
                </h1>
                <p className="text-gray-600 mt-2">Manage your classes and track student progress</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% this month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">My Classes</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+8% this month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Videos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalVideos}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+15% this month</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Assessments</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalAssessments}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+22% this month</span>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* AI Teaching Tools */}
          {activeTab === 'ai-tools' && (
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">AI Teaching Tools</h2>
                </div>

                <Tabs defaultValue="lesson-plan" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-xl">
                    <TabsTrigger value="lesson-plan" className="rounded-lg">Lesson Plan</TabsTrigger>
                    <TabsTrigger value="test-creator" className="rounded-lg">Test Creator</TabsTrigger>
                    <TabsTrigger value="classwork" className="rounded-lg">Classwork</TabsTrigger>
                    <TabsTrigger value="schedule" className="rounded-lg">Schedule</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lesson-plan" className="mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Lesson Plan Generator</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                          <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Select subject</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>History</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                          <input
                            type="text"
                            placeholder="e.g., Quadratic Equations"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                          <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Select grade</option>
                            <option>Grade 9</option>
                            <option>Grade 10</option>
                            <option>Grade 11</option>
                            <option>Grade 12</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                          <input
                            type="number"
                            defaultValue="60"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Lesson Plan
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="test-creator" className="mt-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Test Creator</h3>
                      <p className="text-gray-600 mb-6">Generate customized tests and quizzes for your students</p>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl">
                        <FileText className="w-5 h-5 mr-2" />
                        Create Test
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="classwork" className="mt-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Classwork Generator</h3>
                      <p className="text-gray-600 mb-6">Create assignments and homework for your classes</p>
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl">
                        <ClipboardList className="w-5 h-5 mr-2" />
                        Generate Classwork
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Planner</h3>
                      <p className="text-gray-600 mb-6">Plan your teaching schedule and class timings</p>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl">
                        <CalendarDays className="w-5 h-5 mr-2" />
                        Plan Schedule
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Content Management */}
          {activeTab === 'content' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Content Management</h2>
                <div className="flex space-x-3">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Assessment
                  </Button>
                </div>
              </div>

              {/* Videos */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Videos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{video.subject}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{video.duration}</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessments */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">My Assessments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assessment.subject}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{assessment.questions} questions</span>
                        <span>{assessment.attempts} attempts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Classes */}
          {activeTab === 'classes' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Classes</h2>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign to Class
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.totalClasses > 0 ? (
                  // Show real classes from teacher's assigned classes
                  Array.from({ length: stats.totalClasses }, (_, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Class {i + 1}</h3>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-medium">{Math.floor(stats.totalStudents / stats.totalClasses)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Subject:</span>
                          <span className="font-medium">Assigned Subject</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Schedule:</span>
                          <span className="font-medium">TBD</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" className="flex-1">View Students</Button>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show message when no classes assigned
                  <div className="col-span-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Assigned</h3>
                    <p className="text-gray-600 mb-4">You haven't been assigned to any classes yet. Contact your administrator.</p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                      Request Class Assignment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === 'students' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">My Students</h2>
                <div className="flex space-x-3">
                  <Button variant="outline">Filter</Button>
                  <Button variant="outline">Export</Button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Class</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Exam</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-blue-100 text-blue-800">{student.classNumber}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" 
                                  style={{ width: `${student.performance}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{student.performance}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-600">{student.lastExamScore}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">View</Button>
                              <Button size="sm" variant="outline">Message</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Student Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium text-blue-600">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-medium text-purple-600">78%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Content Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Video Views</span>
                      <span className="font-medium text-green-600">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Assessment Attempts</span>
                      <span className="font-medium text-blue-600">567</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg. Rating</span>
                      <span className="font-medium text-purple-600">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
