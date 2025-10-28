import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Upload,
  Download,
  Shield,
  GraduationCap,
  UserPlus,
  FileSpreadsheet,
  Database,
  Activity,
  LogOut,
  FileText,
  Play,
  Target,
  Menu
} from 'lucide-react';
import UserManagement from '@/components/admin/user-management';
import ClassManagement from '@/components/admin/class-management';
import ClassDashboard from '@/components/admin/class-dashboard';
import TeacherManagement from '@/components/admin/teacher-management';
import SubjectManagement from '@/components/admin/subject-management';
import ExamManagement from '@/components/admin/exam-management';
import VideoManagement from '@/components/admin/video-management';
import AssessmentManagement from '@/components/admin/assessment-management';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();


  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.log('No auth token found');
          window.location.href = '/signin';
          return;
        }

        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Admin dashboard auth check - user data:', data);
          if (data.user && data.user.role === 'admin') {
            console.log('Admin user authenticated successfully');
            setIsAuthenticated(true);
          } else {
            console.log('User is not admin, role:', data.user?.role);
            window.location.href = '/signin';
          }
        } else {
          console.log('Admin dashboard auth check failed with status:', response.status);
          const errorText = await response.text();
          console.log('Response text:', errorText);
          alert(`Authentication failed. Status: ${response.status}, Response: ${errorText}`);
          window.location.href = '/signin';
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/signin';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  const [stats, setStats] = useState({
    totalStudents: 150,
    totalTeachers: 0,
    totalClasses: 8,
    totalVideos: 0,
    totalQuizzes: 25,
    totalAssessments: 0,
    activeUsers: 45,
    recentActivity: [
      {
        id: 1,
        type: 'user',
        action: 'New student registered',
        user: 'John Doe',
        time: '2 hours ago'
      },
      {
        id: 2,
        type: 'path',
        action: 'Learning path completed',
        user: 'Jane Smith',
        time: '4 hours ago'
      },
      {
        id: 3,
        type: 'user',
        action: 'Class assignment updated',
        user: 'Admin',
        time: '6 hours ago'
      }
    ]
  });

  useEffect(() => {
    // Fetch admin dashboard data
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found for admin stats');
        return;
      }

      // Get admin info first
      const adminRes = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!adminRes.ok) {
        console.log('Failed to get admin info');
        return;
      }
      
      const adminData = await adminRes.json();
      const adminId = adminData.user.id;
      console.log('Admin ID for data fetching:', adminId);

      // Fetch admin-specific data using admin endpoints
      const [studentsRes, teachersRes, videosRes, assessmentsRes] = await Promise.all([
        fetch('https://asli-stud-back-production.up.railway.app/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://asli-stud-back-production.up.railway.app/api/admin/teachers', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://asli-stud-back-production.up.railway.app/api/videos', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://asli-stud-back-production.up.railway.app/api/assessments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const students = studentsRes.ok ? await studentsRes.json() : [];
      const teachers = teachersRes.ok ? await teachersRes.json() : [];
      const videos = videosRes.ok ? await videosRes.json() : [];
      const assessments = assessmentsRes.ok ? await assessmentsRes.json() : [];

      console.log('Admin-specific data:', {
        students: students.length || 0,
        teachers: teachers.length || 0,
        videos: videos.length || 0,
        assessments: assessments.length || 0
      });

      setStats({
        totalStudents: students.length || 0,
        totalTeachers: teachers.length || 0,
        totalClasses: 8,
        totalVideos: videos.length || 0,
        totalQuizzes: 25,
        totalAssessments: assessments.length || 0,
        activeUsers: Math.floor((students.length || 0) * 0.8),
        recentActivity: [
          { id: 1, action: 'New video uploaded', user: 'John Doe', time: '2 hours ago', type: 'video' },
          { id: 2, action: 'Learning path created', user: 'Jane Smith', time: '4 hours ago', type: 'path' },
          { id: 3, action: 'Assessment published', user: 'Mike Johnson', time: '6 hours ago', type: 'assessment' },
          { id: 4, action: 'User registered', user: 'Sarah Wilson', time: '8 hours ago', type: 'user' }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      // Set mock data for development
      setStats({
        totalStudents: 150,
        totalTeachers: 25,
        totalClasses: 8,
        totalVideos: 45,
        totalQuizzes: 25,
        totalAssessments: 12,
        activeUsers: 120,
        recentActivity: [
          { id: 1, action: 'New video uploaded', user: 'John Doe', time: '2 hours ago', type: 'video' },
          { id: 2, action: 'Learning path created', user: 'Jane Smith', time: '4 hours ago', type: 'path' },
          { id: 3, action: 'Assessment published', user: 'Mike Johnson', time: '6 hours ago', type: 'assessment' },
          { id: 4, action: 'User registered', user: 'Sarah Wilson', time: '8 hours ago', type: 'user' }
        ]
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Loading...</h2>
          <p className="text-gray-600">Preparing your admin dashboard</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-white/20">
          <div className="flex items-center justify-between p-responsive">
            <div className="flex items-center space-x-responsive">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-responsive-sm">AS</span>
              </div>
              <div>
                <h1 className="text-responsive-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ALSI STUD</h1>
                <p className="text-responsive-xs text-gray-600 font-medium">Admin Panel</p>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="p-responsive">
                  <div className="flex items-center space-x-responsive mb-responsive">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-responsive-lg">AS</span>
                    </div>
                    <div>
                      <h1 className="text-responsive-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ALSI STUD</h1>
                      <p className="text-responsive-xs text-gray-600 font-medium">Admin Panel</p>
                    </div>
                  </div>
                  <nav className="space-responsive">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'overview' 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border-r-4 border-purple-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-900'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('students')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'students' 
                          ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 border-r-4 border-blue-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-900'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Students</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('classes')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'classes' 
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border-r-4 border-emerald-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-medium">Classes</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('teachers')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'teachers' 
                          ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-900 border-r-4 border-orange-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-900'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Teachers</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('subjects')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'subjects' 
                          ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-900 border-r-4 border-violet-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-900'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">Subjects</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('exams')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'exams' 
                          ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-900 border-r-4 border-indigo-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-900'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Weekend Exams</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('videos')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'videos' 
                          ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-900 border-r-4 border-pink-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-900'
                      }`}
                    >
                      <Play className="w-4 h-4" />
                      <span className="font-medium">Videos</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('assessments')}
                      className={`w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm ${
                        activeTab === 'assessments' 
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-r-4 border-amber-500 shadow-lg' 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-900'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      <span className="font-medium">Assessments</span>
                    </button>
                    
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/logout', {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                              'Content-Type': 'application/json'
                            }
                          });
                          if (response.ok) {
                            window.location.href = '/signin';
                          }
                        } catch (error) {
                          console.error('Logout failed:', error);
                          window.location.href = '/signin';
                        }
                      }}
                      className="w-full flex items-center space-x-responsive px-responsive py-responsive rounded-responsive text-left transition-all duration-200 backdrop-blur-sm text-responsive-sm text-gray-700 hover:bg-red-50 hover:text-red-900"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 bg-white/60 backdrop-blur-xl shadow-2xl border-r border-white/20">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-xl">AS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ALSI STUD</h1>
              <p className="text-xs text-gray-600 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border-r-4 border-purple-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'students' 
                ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 border-r-4 border-blue-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Students</span>
          </button>
          
          <button
            onClick={() => setActiveTab('classes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'classes' 
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border-r-4 border-emerald-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Classes</span>
          </button>
          
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'teachers' 
                ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-900 border-r-4 border-orange-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Teachers</span>
          </button>
          
          <button
            onClick={() => setActiveTab('subjects')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'subjects' 
                ? 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-900 border-r-4 border-violet-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Subjects</span>
          </button>
          
          <button
            onClick={() => setActiveTab('exams')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'exams' 
                ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-900 border-r-4 border-indigo-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Weekend Exams</span>
          </button>
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'videos' 
                ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-900 border-r-4 border-pink-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-900'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Videos</span>
          </button>
          
          <button
            onClick={() => setActiveTab('assessments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'assessments' 
                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border-r-4 border-amber-500 shadow-lg' 
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-900'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Assessments</span>
          </button>
          
        </nav>
      </div>
      )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 px-responsive py-responsive">
            <div className="flex-responsive-col items-center sm:items-start justify-between space-y-responsive sm:space-y-0">
              <div className="text-center sm:text-left">
                <h2 className="text-responsive-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent capitalize">{activeTab}</h2>
                <p className="text-gray-600 text-responsive-sm font-medium">Manage your learning platform with style</p>
              </div>
              {!isMobile && (
                <div className="flex items-center space-x-responsive">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/auth/logout', {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                            'Content-Type': 'application/json'
                          }
                        });
                        if (response.ok) {
                          window.location.href = '/signin';
                        }
                      } catch (error) {
                        console.error('Logout failed:', error);
                        window.location.href = '/signin';
                      }
                    }}
                    className="border-purple-200 text-purple-800 hover:bg-purple-50 backdrop-blur-sm rounded-responsive"
                  >
                    <LogOut className="w-4 h-4 mr-responsive" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className={`flex-1 p-responsive overflow-auto ${isMobile ? 'pt-20' : ''}`}>
          {activeTab === 'overview' && (
            <div className="space-y-8">
            {/* Colorful Stats Cards */}
            <div className="grid-responsive-4 gap-responsive">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Total Students</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.totalStudents}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+12% this month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Active Classes</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.totalClasses}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+8% this month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden bg-gradient-to-br from-violet-500 to-purple-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Active Users</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.activeUsers}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+18% this month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Teachers</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.totalTeachers || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+5% this month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Videos</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.totalVideos || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+15% this month</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-yellow-500 rounded-responsive p-responsive shadow-responsive hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/90 text-responsive-xs font-medium">Assessments</p>
                      <p className="text-responsive-xl font-bold text-white">{stats.totalAssessments || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 text-responsive-xs">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>+22% this month</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Admin-Specific Data Section */}
            <div className="grid-responsive-2 gap-responsive">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 rounded-responsive p-responsive shadow-responsive"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-responsive-lg font-bold text-white">Your Students</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-responsive-sm font-medium">Total Students Assigned</span>
                      <span className="text-responsive-xl font-bold text-white">{stats.totalStudents}</span>
                    </div>
                    <div className="text-white/80 text-responsive-xs">
                      These are the students specifically assigned to your admin account
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-xl"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Your Teachers</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/90 text-lg font-medium">Total Teachers Assigned</span>
                      <span className="text-responsive-xl font-bold text-white">{stats.totalTeachers || 0}</span>
                    </div>
                    <div className="text-white/80 text-responsive-xs">
                      These are the teachers specifically assigned to your admin account
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            {/* Recent Activity removed per request */}
            </div>
          )}

          {activeTab === 'students' && <UserManagement />}
          {activeTab === 'classes' && <ClassDashboard />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'subjects' && <SubjectManagement />}
          {activeTab === 'exams' && <ExamManagement />}
          {activeTab === 'videos' && <VideoManagement />}
          {activeTab === 'assessments' && <AssessmentManagement />}
          {/* Analytics tab removed */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
