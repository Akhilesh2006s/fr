import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  UsersIcon, 
  GraduationCapIcon, 
  BookOpenIcon, 
  TrendingUpIcon,
  AwardIcon,
  ClockIcon,
  TargetIcon,
  BarChart3Icon,
  EyeIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminAnalytics {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  stats: {
    students: number;
    teachers: number;
    videos: number;
    assessments: number;
    exams: number;
    totalExamsTaken: number;
    averageScore: string;
    averageAccuracy: string;
  };
  analytics: {
    topStudents: Array<{
      studentName: string;
      studentEmail: string;
      totalExams: number;
      averageScore: string;
    }>;
    recentResults: Array<{
      examTitle: string;
      studentName: string;
      score: number;
      marks: string;
      completedAt: string;
    }>;
    subjectPerformance: Array<{
      subject: string;
      accuracy: string;
      averageScore: string;
      totalQuestions: number;
      correctAnswers: number;
    }>;
  };
}

export default function SuperAdminAnalyticsDashboard() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/super-admin/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.data || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch admin analytics",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return "text-green-600 bg-green-100";
    if (numScore >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading admin analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Analytics</h1>
          <p className="text-gray-600">Comprehensive analytics for all admins and their students</p>
        </div>
        <Button onClick={fetchAdminAnalytics} variant="outline">
          <BarChart3Icon className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
              </div>
              <UsersIcon className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {admins.reduce((sum, admin) => sum + admin.stats.students, 0)}
                </p>
              </div>
              <GraduationCapIcon className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {admins.reduce((sum, admin) => sum + admin.stats.teachers, 0)}
                </p>
              </div>
              <BookOpenIcon className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams Taken</p>
                <p className="text-3xl font-bold text-gray-900">
                  {admins.reduce((sum, admin) => sum + admin.stats.totalExamsTaken, 0)}
                </p>
              </div>
              <AwardIcon className="h-12 w-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3Icon className="w-5 h-5 mr-2" />
            Admin Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Avg Accuracy</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(admin.status)}>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-1 text-blue-500" />
                      {admin.stats.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BookOpenIcon className="w-4 h-4 mr-1 text-purple-500" />
                      {admin.stats.teachers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AwardIcon className="w-4 h-4 mr-1 text-orange-500" />
                      {admin.stats.totalExamsTaken}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(admin.stats.averageScore)}>
                      {admin.stats.averageScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(admin.stats.averageAccuracy)}>
                      {admin.stats.averageAccuracy}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAdmin(admin)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Admin Analytics Modal */}
      {selectedAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3Icon className="w-5 h-5 mr-2" />
                Detailed Analytics: {selectedAdmin?.name || 'Unknown Admin'}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedAdmin(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Top Students</TabsTrigger>
                <TabsTrigger value="recent">Recent Results</TabsTrigger>
                <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Main Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Total Students</p>
                          <p className="text-2xl font-bold text-blue-900">{selectedAdmin?.stats?.students || 0}</p>
                        </div>
                        <UsersIcon className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Total Teachers</p>
                          <p className="text-2xl font-bold text-purple-900">{selectedAdmin?.stats?.teachers || 0}</p>
                        </div>
                        <BookOpenIcon className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Exams Conducted</p>
                          <p className="text-2xl font-bold text-green-900">{selectedAdmin?.stats?.exams || 0}</p>
                        </div>
                        <AwardIcon className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">Total Videos</p>
                          <p className="text-2xl font-bold text-orange-900">{selectedAdmin?.stats?.videos || 0}</p>
                        </div>
                        <BookOpenIcon className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Scorer */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                        Top Scorer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAdmin?.analytics?.topStudents?.length > 0 ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {selectedAdmin.analytics.topStudents[0].studentName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {selectedAdmin.analytics.topStudents[0].studentEmail}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                                {selectedAdmin.analytics.topStudents[0].averageScore}%
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {selectedAdmin.analytics.topStudents[0].totalExams} exams
                              </p>
                            </div>
                          </div>
                          {selectedAdmin.analytics.topStudents.length > 1 && (
                            <div className="text-sm text-gray-600">
                              <p className="font-medium mb-2">Other Top Performers:</p>
                              <div className="space-y-1">
                                {selectedAdmin.analytics.topStudents.slice(1, 3).map((student, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span>{student.studentName}</span>
                                    <Badge variant="outline">{student.averageScore}%</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <StarIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No exam results available yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Subject-wise Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TargetIcon className="w-5 h-5 mr-2 text-blue-500" />
                        Subject-wise Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAdmin?.analytics?.subjectPerformance?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedAdmin.analytics.subjectPerformance.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                                <span className="font-medium capitalize">{subject.subject}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getScoreColor(subject.accuracy)}>
                                  {subject.accuracy}%
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {subject.correctAnswers}/{subject.totalQuestions}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <TargetIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No subject performance data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3Icon className="w-5 h-5 mr-2 text-green-500" />
                      Performance Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <TrendingUpIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-600">Average Score</p>
                        <p className="text-2xl font-bold text-green-900">
                          {selectedAdmin?.stats?.averageScore || '0'}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <CheckCircleIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-600">Average Accuracy</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {selectedAdmin?.stats?.averageAccuracy || '0'}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <BookOpenIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-purple-600">Total Assessments</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {selectedAdmin?.stats?.assessments || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <StarIcon className="w-5 h-5 mr-2" />
                      Top Performing Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Exams Taken</TableHead>
                          <TableHead>Average Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAdmin?.analytics?.topStudents?.map((student, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell className="text-gray-500">{student.studentEmail}</TableCell>
                            <TableCell>{student.totalExams}</TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(student.averageScore)}>
                                {student.averageScore}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500">
                              No student data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Recent Exam Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAdmin?.analytics?.recentResults?.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.examTitle}</TableCell>
                            <TableCell>{result.studentName}</TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(result.score.toString())}>
                                {result.score}%
                              </Badge>
                            </TableCell>
                            <TableCell>{result.marks}</TableCell>
                            <TableCell>{formatDate(result.completedAt)}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                              No recent exam results available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subjects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TargetIcon className="w-5 h-5 mr-2" />
                      Subject-wise Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Accuracy</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>Questions</TableHead>
                          <TableHead>Correct</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAdmin?.analytics?.subjectPerformance?.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium capitalize">{subject.subject}</TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(subject.accuracy)}>
                                {subject.accuracy}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getScoreColor(subject.averageScore)}>
                                {subject.averageScore}%
                              </Badge>
                            </TableCell>
                            <TableCell>{subject.totalQuestions}</TableCell>
                            <TableCell>{subject.correctAnswers}</TableCell>
                          </TableRow>
                        )) || (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                              No subject performance data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
