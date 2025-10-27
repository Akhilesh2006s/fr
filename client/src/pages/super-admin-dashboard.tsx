import { useState, useEffect } from "react";
import { SuperAdminSidebar } from "@/components/dashboard/SuperAdminSidebar";
import AdminManagement from "@/components/admin/AdminManagement";
import SuperAdminAnalyticsDashboard from "./super-admin-analytics";
import AIAnalyticsDashboard from "./ai-analytics-dashboard";
import DetailedAIAnalyticsDashboard from "./detailed-ai-analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellIcon, LogOutIcon, UsersIcon, TrendingUpIcon, BookIcon, Presentation, UserPlusIcon, BookPlusIcon, SettingsIcon, DownloadIcon, HomeIcon, CrownIcon, BarChart3Icon, CreditCardIcon, ArrowUpRightIcon, ArrowDownRightIcon, StarIcon, TargetIcon, BrainIcon, ZapIcon, AlertTriangleIcon, TrendingDownIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SuperAdminView = 'dashboard' | 'admins' | 'analytics' | 'ai-analytics' | 'detailed-analytics' | 'subscriptions' | 'settings';

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<SuperAdminView>('dashboard');
  const [user] = useState({ fullName: 'Super Admin', role: 'super-admin' });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    courses: 0,
    assessments: 0,
    exams: 0,
    examResults: 0,
    activeVideos: 0,
    activeAssessments: 0,
    avgExamsPerStudent: 0,
    contentEngagement: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch real dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/super-admin/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        } else {
          console.error('Failed to fetch dashboard stats:', response.status);
          toast({
            title: "Error",
            description: "Failed to fetch dashboard statistics",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive"
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [toast]);

  const handleLogout = () => {
    // Clear localStorage for Super Admin logout
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = "/";
  };

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Beautiful Super Admin Dashboard - Enhanced Version */}
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-900">
                  {isLoadingStats ? '...' : stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">Real-time data</p>
              </div>
              <UsersIcon className="h-12 w-12 text-blue-500" />
            </div>
            <div className="mt-4">
              <button 
                onClick={() => setCurrentView('admins')} 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                Click to manage admins <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Exam Results</p>
                <p className="text-3xl font-bold text-green-900">{isLoadingStats ? '...' : stats.examResults}</p>
                <p className="text-sm text-green-600">Total completed</p>
              </div>
              <TrendingUpIcon className="h-12 w-12 text-green-500" />
            </div>
            <div className="mt-4">
              <button 
                onClick={() => setCurrentView('analytics')} 
                className="text-sm text-green-600 hover:text-green-800 flex items-center"
              >
                Click for analytics <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Courses</p>
                <p className="text-3xl font-bold text-purple-900">{isLoadingStats ? '...' : stats.courses}</p>
                <p className="text-sm text-purple-600">Real-time data</p>
              </div>
              <BookIcon className="h-12 w-12 text-purple-500" />
            </div>
            <div className="mt-4">
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
                Click to manage courses <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Admins</p>
                <p className="text-3xl font-bold text-yellow-900">{isLoadingStats ? '...' : stats.totalAdmins}</p>
                <p className="text-sm text-yellow-600">Real-time data</p>
              </div>
              <CrownIcon className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="mt-4">
              <a href="#" className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center">
                Click for admin details <ArrowUpRightIcon className="ml-1 h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Add New Admin</h3>
                <p className="text-sm text-blue-600">Create new admin accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookPlusIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Create Course</h3>
                <p className="text-sm text-green-600">Add new educational content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer" onClick={() => setCurrentView('ai-analytics')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BrainIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">AI Analytics</h3>
                <p className="text-sm text-purple-600">Advanced ML insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DownloadIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">Export Data</h3>
                <p className="text-sm text-orange-600">Download platform analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <StarIcon className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">AI Insights & Recommendations</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">AI Analysis Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Next Month Revenue (AI Predicted)</p>
                  <p className="text-2xl font-bold text-purple-900">₹289,450</p>
                  <p className="text-sm text-green-600">+18.2% growth</p>
                </div>
                <TrendingUpIcon className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Predicted New Students</p>
                  <p className="text-2xl font-bold text-blue-900">89</p>
                  <p className="text-sm text-blue-600">Next 30 days</p>
                </div>
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Students at Churn Risk</p>
                  <p className="text-2xl font-bold text-orange-900">12</p>
                  <p className="text-sm text-orange-600">Needs attention</p>
                </div>
                <AlertTriangleIcon className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">AI Engagement Score</p>
                  <p className="text-2xl font-bold text-green-900">92%</p>
                  <p className="text-sm text-green-600">Excellent</p>
                </div>
                <ZapIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <TargetIcon className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <TargetIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-gray-600">AI-powered insights and recommendations will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Generated Insights */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BrainIcon className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-bold text-gray-900">Auto-Generated Insights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BrainIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Peak learning hours: 7-9 PM (43% of daily activity)</p>
                  <p className="text-xs text-purple-600">Generated 2 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Most popular subject: Mathematics (35% of total engagement)</p>
                  <p className="text-xs text-blue-600">Generated 1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderAdminsContent = () => (
    <AdminManagement />
  );

  const renderAnalyticsContent = () => (
    <SuperAdminAnalyticsDashboard />
  );

  const renderSubscriptionsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Subscription Management</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscriptions</h3>
            <p className="text-gray-600 mb-4">Manage user subscriptions and billing</p>
            <Button>View Subscriptions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <SettingsIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Configure system settings and preferences</p>
            <Button>Open Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboardContent();
      case 'admins':
        return renderAdminsContent();
      case 'analytics':
        return renderAnalyticsContent();
      case 'ai-analytics':
        return <AIAnalyticsDashboard />;
      case 'detailed-analytics':
        return <DetailedAIAnalyticsDashboard />;
      case 'subscriptions':
        return renderSubscriptionsContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SuperAdminSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          user={user} 
        />
        
        <div className="flex-1">
          <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard - Enhanced Version</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.fullName || 'Super Admin'}!</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <BellIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                    <LogOutIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
