import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Target
} from 'lucide-react';
import UserManagement from '@/components/admin/user-management';
import ClassManagement from '@/components/admin/class-management';
import ClassDashboard from '@/components/admin/class-dashboard';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';
import TeacherManagement from '@/components/admin/teacher-management';
import SubjectManagement from '@/components/admin/subject-management';
import ExamManagement from '@/components/admin/exam-management';
import VideoManagement from '@/components/admin/video-management';
import AssessmentManagement from '@/components/admin/assessment-management';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


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

        const response = await fetch('http://localhost:3001/api/auth/me', {
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
      const adminRes = await fetch('http://localhost:3001/api/auth/me', {
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
        fetch('http://localhost:3001/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/admin/teachers', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/videos', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/assessments', {
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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sky-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex">
      {/* Modern Sidebar */}
      <div className="w-64 bg-white/40 backdrop-blur-xl shadow-lg border-r border-sky-200">
        {/* Logo Section */}
        <div className="p-6 border-b border-sky-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-sky-900">ALSI STUD</h1>
              <p className="text-xs text-sky-700">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'overview' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'students' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Students</span>
          </button>
          
          <button
            onClick={() => setActiveTab('classes')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'classes' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Classes</span>
          </button>
          
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'teachers' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Teachers</span>
          </button>
          
          <button
            onClick={() => setActiveTab('subjects')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'subjects' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Subjects</span>
          </button>
          
          <button
            onClick={() => setActiveTab('exams')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'exams' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Weekend Exams</span>
          </button>
          
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'videos' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <Play className="w-5 h-5" />
            <span className="font-medium">Videos</span>
          </button>
          
          <button
            onClick={() => setActiveTab('assessments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'assessments' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Assessments</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 backdrop-blur-sm ${
              activeTab === 'analytics' 
                ? 'bg-sky-100 text-sky-900 border-r-2 border-sky-500 shadow-lg' 
                : 'text-sky-700 hover:bg-sky-50 hover:text-sky-900'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/60 backdrop-blur-xl border-b border-sky-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-sky-900 capitalize">{activeTab}</h2>
              <p className="text-sky-700">Manage your learning platform</p>
            </div>
            <div className="flex items-center space-x-4">
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
                className="border-sky-200 text-sky-800 hover:bg-sky-50 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
            {/* Professional Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Classes</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClasses}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8% this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>


              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +18% this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin-Specific Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Users className="w-5 h-5" />
                    <span>Your Students</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Total Students Assigned</span>
                      <span className="text-2xl font-bold text-blue-900">{stats.totalStudents}</span>
                    </div>
                    <div className="text-xs text-blue-600">
                      These are the students specifically assigned to your admin account
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-900">
                    <GraduationCap className="w-5 h-5" />
                    <span>Your Teachers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Total Teachers Assigned</span>
                      <span className="text-2xl font-bold text-purple-900">{stats.totalTeachers || 0}</span>
                    </div>
                    <div className="text-xs text-purple-600">
                      These are the teachers specifically assigned to your admin account
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'path' && <BookOpen className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'user' && <Users className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}

          {activeTab === 'students' && <UserManagement />}
          {activeTab === 'classes' && <ClassDashboard />}
          {activeTab === 'teachers' && <TeacherManagement />}
          {activeTab === 'subjects' && <SubjectManagement />}
          {activeTab === 'exams' && <ExamManagement />}
          {activeTab === 'videos' && <VideoManagement />}
          {activeTab === 'assessments' && <AssessmentManagement />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
