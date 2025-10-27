import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Download, 
  UserPlus,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  TrendingUp
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  classNumber: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const UserManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [deleteAllConfirmStep, setDeleteAllConfirmStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    classNumber: '',
    phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://asli-stud-back-production.up.railway.app/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if data is an array
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        throw new Error('Invalid data format received from server');
      }
      
      // Map backend data to frontend format
      const mappedStudents = data.map((user: any) => ({
        id: user._id || user.id,
        name: user.fullName || user.name || 'Unknown Student',
        email: user.email || '',
        classNumber: user.classNumber || 'N/A',
        phone: user.phone || '',
        status: user.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt || new Date().toISOString(),
        lastLogin: user.lastLogin || null
      }));
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Set mock data for development
      setStudents([
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          classNumber: '10A',
          phone: '+1234567890',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          classNumber: '12B',
          phone: '+1234567891',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ]);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://asli-stud-back-production.up.railway.app/api/admin/users', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
        body: JSON.stringify({
          fullName: newStudent.name,
          email: newStudent.email,
          classNumber: newStudent.classNumber,
          phone: newStudent.phone,
          role: 'student',
          password: 'Password123' // Default password for all students
        })
      });

      if (response.ok) {
        // Reset form and close dialog
        setNewStudent({ name: '', email: '', classNumber: '', phone: '' });
        setIsAddDialogOpen(false);
        // Refresh the students list
        fetchStudents();
        alert('Student added successfully! Default password: Password123');
      } else {
        const errorData = await response.json();
        alert(`Failed to add student: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleCSVUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading file:', file.name, file.size, 'bytes');
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://asli-stud-back-production.up.railway.app/api/admin/users/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      console.log('Upload response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        setIsUploadDialogOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchStudents();
        
        // Show detailed results
        let message = `CSV uploaded successfully!\nCreated ${result.createdUsers?.length || 0} students.\nDefault password: Password123`;
        
        if (result.errors && result.errors.length > 0) {
          message += `\n\nErrors:\n${result.errors.join('\n')}`;
        }
        
        alert(message);
      } else {
        const errorData = await response.json();
        alert(`Failed to upload CSV: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to upload CSV:', error);
      alert('Failed to upload CSV. Please try again.');
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`https://asli-stud-back-production.up.railway.app/api/admin/users/${studentId}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json' 
          }
        });

        if (response.ok) {
          fetchStudents();
          alert(`${studentName} has been deleted successfully.`);
        } else {
          const errorData = await response.json();
          alert(`Failed to delete student: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleDeleteAllStudents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://asli-stud-back-production.up.railway.app/api/admin/users/delete-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStudents([]);
        setIsDeleteAllDialogOpen(false);
        setDeleteAllConfirmStep(1);
        alert('All students have been deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete all students: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete all students:', error);
      alert('Failed to delete all students. Please try again.');
    }
  };

  const resetDeleteAllDialog = () => {
    setDeleteAllConfirmStep(1);
    setIsDeleteAllDialogOpen(false);
  };

  const filteredStudents = students.filter(student =>
    (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.classNumber || '').includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="space-y-8 p-6">
        {/* Hero Section with Enhanced Stats */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 opacity-30 rounded-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-sky-200">
            <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-4xl font-bold text-sky-900">
                  Student Management
                </h1>
                <p className="text-sky-800 mt-2 text-lg">Comprehensive student oversight and analytics</p>
            </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-sky-100 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sky-800 font-medium">System Online</span>
            </div>
          </div>
        </div>
        
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <Users className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sky-700 text-sm font-medium">Total Students</p>
                      <p className="text-3xl font-bold text-sky-900">{students.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% this month</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-6 h-6 text-sky-600" />
            </div>
                    <div className="text-right">
                      <p className="text-sky-700 text-sm font-medium">Active Students</p>
                      <p className="text-3xl font-bold text-sky-900">{students.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Online now</span>
          </div>
        </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <GraduationCap className="w-6 h-6 text-sky-600" />
            </div>
                    <div className="text-right">
                      <p className="text-sky-700 text-sm font-medium">Active Classes</p>
                      <p className="text-3xl font-bold text-sky-900">{new Set(students.map(s => s.classNumber)).size}</p>
            </div>
          </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>Classes running</span>
          </div>
        </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sky-700 text-sm font-medium">New This Month</p>
                      <p className="text-3xl font-bold text-sky-900">12</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <span>+25% growth</span>
            </div>
            </div>
              </motion.div>
          </div>
        </div>
      </div>

        {/* Enhanced Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-sky-200"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sky-500 w-5 h-5" />
              <Input
                  placeholder="Search students by name, email, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white/70 border-sky-200 text-sky-900 placeholder-sky-600 focus:border-sky-400 focus:ring-sky-400/20 rounded-xl backdrop-blur-sm"
              />
            </div>
              <div className="flex items-center gap-3">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 backdrop-blur-sm"
                >
              <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
            </Button>
          </div>
            </div>
            
            <div className="flex items-center gap-3">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 backdrop-blur-sm"
                  >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>
              </DialogTrigger>
                <DialogContent className="max-w-md bg-white/80 border-sky-200 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-sky-900">Upload Students CSV</DialogTitle>
                    <DialogDescription className="text-sky-700">
                      Upload a CSV file with student information. All students will have the default password "Password123".
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-sky-300 rounded-xl p-8 text-center hover:border-sky-400 transition-colors bg-sky-50 backdrop-blur-sm">
                      <FileSpreadsheet className="w-16 h-16 text-sky-600 mx-auto mb-4" />
                      <p className="text-sky-800 mb-2 font-medium">Drop your CSV file here</p>
                      <p className="text-sm text-sky-700 mb-4">CSV Format (comma-separated):</p>
                      <div className="bg-white/70 rounded-lg p-4 mb-4 text-left">
                        <p className="text-xs text-sky-600 mb-2 font-medium">Required columns:</p>
                        <p className="text-xs text-sky-700">name, email, classnumber, phone</p>
                        <p className="text-xs text-sky-600 mt-2 font-medium">Example:</p>
                        <p className="text-xs text-sky-700">John Doe, john@email.com, Class-101, +1234567890</p>
                        <p className="text-xs text-sky-600 mt-2 font-medium">Note: All students will have default password "Password123"</p>
                        <div className="mt-3">
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs border-sky-200 text-sky-700 hover:bg-sky-50"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = '/student_template.csv';
                              link.download = 'student_template.csv';
                              link.click();
                            }}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download Template
                          </Button>
                        </div>
                      </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                    className="mt-4 w-full"
                    ref={fileInputRef}
                  />
                  
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
                      <p className="text-sm text-sky-700 mb-2">Selected file:</p>
                      <p className="text-sm font-medium text-sky-900">{selectedFile.name}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsUploadDialogOpen(false);
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="border-sky-200 text-sky-700 hover:bg-sky-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      onClick={() => {
                        if (selectedFile) {
                          handleCSVUpload(selectedFile);
                        }
                      }}
                      disabled={!selectedFile}
                      className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Students
                    </Button>
                  </div>
                </div>
        </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  >
              <UserPlus className="w-4 h-4 mr-2" />
                    Add New Student
            </Button>
          </DialogTrigger>
                <DialogContent className="max-w-lg bg-white/80 border-sky-200 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-sky-900">Add New Student</DialogTitle>
                    <DialogDescription className="text-sky-700">
                      Add a new student to the system. The student will have the default password "Password123".
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddStudent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-sky-800">Full Name</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-sky-800">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="classNumber" className="text-sm font-medium text-sky-800">Class Number</Label>
                  <Input
                    id="classNumber"
                    value={newStudent.classNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, classNumber: e.target.value })}
                          className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-sky-800">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                          className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                  />
                </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-sky-800">Default Password</Label>
                      <Input
                        id="password"
                        value="Password123"
                        disabled
                        className="rounded-xl bg-sky-50 border-sky-200 text-sky-700 backdrop-blur-sm cursor-not-allowed"
                      />
                      <p className="text-xs text-sky-600">This is the default password for all new students</p>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className="rounded-xl border-sky-200 text-sky-800 hover:bg-sky-50 backdrop-blur-sm"
                      >
                    Cancel
                  </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl backdrop-blur-sm"
                      >
                  Add Student
                </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            {/* Delete All Students Button */}
            <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg"
                  variant="destructive"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 backdrop-blur-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Students
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white/80 border-red-200 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-red-900">
                    {deleteAllConfirmStep === 1 ? 'Delete All Students' : 'Final Confirmation'}
                  </DialogTitle>
                  <DialogDescription className="text-red-700">
                    {deleteAllConfirmStep === 1 
                      ? 'This action will permanently delete ALL students from the system. This cannot be undone.'
                      : 'Are you absolutely sure you want to delete ALL students? This is your final warning.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {deleteAllConfirmStep === 1 ? (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-red-800">
                          <XCircle className="w-5 h-5" />
                          <span className="font-medium">Warning: This will delete {students.length} students</span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetDeleteAllDialog}
                          className="rounded-xl border-red-200 text-red-800 hover:bg-red-50 backdrop-blur-sm"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          onClick={() => setDeleteAllConfirmStep(2)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl backdrop-blur-sm"
                        >
                          Continue
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-red-900">
                          <XCircle className="w-6 h-6" />
                          <span className="font-bold">FINAL WARNING</span>
                        </div>
                        <p className="text-red-800 mt-2">
                          You are about to permanently delete ALL {students.length} students. 
                          This action cannot be undone and will remove all student data from the system.
                        </p>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setDeleteAllConfirmStep(1)}
                          className="rounded-xl border-red-200 text-red-800 hover:bg-red-50 backdrop-blur-sm"
                        >
                          Go Back
                        </Button>
                        <Button 
                          type="button"
                          onClick={handleDeleteAllStudents}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          DELETE ALL STUDENTS
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        </motion.div>

        {/* Modern Students Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-sky-200 overflow-hidden"
        >
          <div className="p-6 border-b border-sky-200">
          <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-sky-900">Students Directory</h3>
                <p className="text-sky-700 mt-1">{filteredStudents.length} students found</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 backdrop-blur-sm"
                >
                <Download className="w-4 h-4 mr-2" />
                  Export Data
              </Button>
            </div>
          </div>
        </div>
        
          {filteredStudents.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-sky-200 hover:border-sky-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {(student.name || 'U').charAt(0).toUpperCase()}
                      </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                            (student.status || 'inactive') === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {(student.status || 'inactive') === 'active' ? (
                              <CheckCircle className="w-3 h-3 text-white" />
                            ) : (
                              <XCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sky-900 text-lg">{student.name || 'Unknown Student'}</h4>
                          <p className="text-sky-700 text-sm">{student.email || 'No email'}</p>
                          <div className="flex items-center mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200 backdrop-blur-sm">
                              <GraduationCap className="w-3 h-3 mr-1" />
                              Class {student.classNumber || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-sky-700">
                        <Mail className="w-4 h-4 mr-3 text-sky-600" />
                        <span className="truncate">{student.email || 'No email'}</span>
                      </div>
                      {student.phone && (
                        <div className="flex items-center text-sm text-sky-700">
                          <Phone className="w-4 h-4 mr-3 text-sky-600" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-sky-700">
                        <Calendar className="w-4 h-4 mr-3 text-sky-600" />
                        <span>Last login: {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString() : 'Never'}</span>
                    </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-sky-200">
                    <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sky-600 hover:text-blue-700 hover:bg-blue-100/50 rounded-lg backdrop-blur-sm"
                        >
                        <Eye className="w-4 h-4" />
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sky-600 hover:text-green-700 hover:bg-green-100/50 rounded-lg backdrop-blur-sm"
                        >
                        <Edit className="w-4 h-4" />
                      </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sky-600 hover:text-red-700 hover:bg-red-100/50 rounded-lg backdrop-blur-sm"
                          onClick={() => handleDeleteStudent(student.id, student.name || 'Unknown Student')}
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sky-600 hover:text-sky-800"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Users className="w-12 h-12 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900 mb-2">No students found</h3>
              <p className="text-sky-700 mb-6">Try adjusting your search criteria or add new students</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 backdrop-blur-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Student
              </Button>
        </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserManagement;