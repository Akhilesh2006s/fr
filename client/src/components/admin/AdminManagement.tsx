import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UsersIcon, UserPlusIcon, EditIcon, TrashIcon, CrownIcon, GraduationCapIcon, BookOpenIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  name: string;
  email: string;
  permissions: string[];
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

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { toast } = useToast();

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
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
          console.log('Fetched admins data:', data);
          
          // Handle both wrapped and direct array responses
          if (Array.isArray(data)) {
            setAdmins(data);
          } else if (data.data && Array.isArray(data.data)) {
            setAdmins(data.data);
          } else {
            console.log('No valid admin data found');
            setAdmins([]);
          }
        } else {
          console.error('API failed with status:', response.status);
          setAdmins([]);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        setAdmins([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (isAddingAdmin) return; // Prevent multiple submissions
    
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check if admin with this email already exists
    const existingAdmin = admins?.find(admin => 
      admin?.email?.toLowerCase() === newAdmin.email.toLowerCase()
    );
    
    if (existingAdmin) {
      toast({
        title: "Admin Already Exists",
        description: "An admin with this email already exists. Please use a different email.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingAdmin(true);
    try {
      const response = await fetch('http://localhost:3001/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        const result = await response.json();
        setAdmins([...(admins || []), result.data]);
        setNewAdmin({ name: '', email: '', password: '' });
        setIsAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Admin added successfully",
        });
      } else {
        const errorData = await response.json();
        console.log('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add admin";
      
      // Show specific error messages
      if (errorMessage.includes('already exists')) {
        toast({
          title: "Admin Already Exists",
          description: "An admin with this email already exists. Please use a different email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!adminId) {
      toast({
        title: "Error",
        description: "Invalid admin ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/admins/${adminId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAdmins((admins || []).filter(admin => admin?.id !== adminId));
        toast({
          title: "Success",
          description: "Admin deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete admin",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600">Manage system administrators and their data</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  placeholder="Enter admin's full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  placeholder="Enter admin's email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  placeholder="Enter temporary password"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin} disabled={isAddingAdmin}>
                  {isAddingAdmin ? 'Adding...' : 'Add Admin'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Admin Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Admins</p>
                <p className="text-3xl font-bold text-blue-900">{admins?.length || 0}</p>
              </div>
              <CrownIcon className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Students</p>
                <p className="text-3xl font-bold text-green-900">
                  {admins?.reduce((sum, admin) => sum + (admin?.stats?.students || 0), 0) || 0}
                </p>
              </div>
              <UsersIcon className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Teachers</p>
                <p className="text-3xl font-bold text-purple-900">
                  {admins?.reduce((sum, admin) => sum + (admin?.stats?.teachers || 0), 0) || 0}
                </p>
              </div>
              <GraduationCapIcon className="h-12 w-12 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admins List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins?.map((admin) => (
          <Card key={admin?.id || Math.random().toString()} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CrownIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{admin?.name || 'Unknown Admin'}</CardTitle>
                    <p className="text-sm text-gray-600">{admin?.email || 'No email'}</p>
                  </div>
                </div>
                <Badge variant={(admin?.status || 'inactive') === 'active' ? 'default' : 'secondary'}>
                  {admin?.status || 'inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{admin?.stats?.students || 0}</p>
                    <p className="text-sm text-green-600">Students</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <GraduationCapIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-900">{admin?.stats?.teachers || 0}</p>
                    <p className="text-sm text-purple-600">Teachers</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    Added: {admin?.joinDate ? new Date(admin.joinDate).toLocaleDateString() : 'Unknown'}
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteAdmin(admin?.id || '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!admins || admins.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <CrownIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Admins Found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first admin</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Add First Admin
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
