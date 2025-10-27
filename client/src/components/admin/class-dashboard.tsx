import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface Class {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade: string;
  teacher: string;
  schedule: string;
  room: string;
  studentCount: number;
  students: Student[];
  createdAt: string;
}

const ClassDashboard = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    subject: '',
    grade: '',
    teacher: '',
    schedule: '',
    room: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        throw new Error('Invalid data format received from server');
      }
      
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
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          classNumber: '10A',
          phone: '+1234567892',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        throw new Error('Invalid data format received from server');
      }
      
      // Use the data directly from backend (already grouped by class)
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      // Set mock data for development
      setClasses([
        {
          id: '10A',
          name: 'Class 10A',
          description: 'Grade 10 Section A',
          subject: 'General',
          grade: '10',
          teacher: 'Ms. Sarah Wilson',
          schedule: 'Mon-Fri 9:00 AM - 3:00 PM',
          room: 'Room 101',
          studentCount: 2,
          students: [],
          createdAt: new Date().toISOString()
        },
        {
          id: '12B',
          name: 'Class 12B',
          description: 'Grade 12 Section B',
          subject: 'General',
          grade: '12',
          teacher: 'Mr. David Brown',
          schedule: 'Mon-Fri 10:00 AM - 4:00 PM',
          room: 'Room 201',
          studentCount: 1,
          students: [],
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newClass)
      });

      if (response.ok) {
        setNewClass({ name: '', description: '', subject: '', grade: '', teacher: '', schedule: '', room: '' });
        setIsAddClassDialogOpen(false);
        fetchClasses();
        alert('Class created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to create class: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create class:', error);
      alert('Failed to create class. Please try again.');
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/classes/${classId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchClasses();
        alert('Class deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete class: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class. Please try again.');
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || classItem.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(classes.map(c => c.subject)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="space-y-8 p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 opacity-30 rounded-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-sky-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-sky-900">Class Management</h1>
                <p className="text-sky-800 mt-2 text-lg">Organize and manage your classes and students</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-sky-100 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sky-800 font-medium">System Online</span>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
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
                      <GraduationCap className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sky-700 text-sm font-medium">Total Classes</p>
                      <p className="text-3xl font-bold text-sky-900">{classes.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>Active classes</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-green-700 text-sm font-medium">Total Students</p>
                      <p className="text-3xl font-bold text-green-900">{classes.reduce((total, cls) => total + cls.studentCount, 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-700 text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Enrolled students</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-violet-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-purple-700 text-sm font-medium">Avg. Class Size</p>
                      <p className="text-3xl font-bold text-purple-900">
                        {classes.length > 0 ? Math.round(classes.reduce((total, cls) => total + cls.studentCount, 0) / classes.length) : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-700 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Students per class</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-500/20 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-orange-700 text-sm font-medium">Subjects</p>
                      <p className="text-3xl font-bold text-orange-900">{subjects.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-700 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>Different subjects</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-sky-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-500 w-4 h-4" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                />
              </div>
              
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48 rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsAddClassDialogOpen(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white backdrop-blur-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-blue-500/10 backdrop-blur-sm"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm">
                      <GraduationCap className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sky-900 text-lg">{classItem.name}</h3>
                      <p className="text-sky-700 text-sm">{classItem.subject}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClass(classItem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-sky-700">
                    <Users className="w-4 h-4 mr-3 text-sky-600" />
                    <span>{classItem.studentCount} students</span>
                  </div>
                  <div className="flex items-center text-sm text-sky-700">
                    <Calendar className="w-4 h-4 mr-3 text-sky-600" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-sky-700">
                    <BookOpen className="w-4 h-4 mr-3 text-sky-600" />
                    <span>{classItem.room}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sky-900 text-sm">Students:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {classItem.students.map(student => (
                      <div key={student.id} className="flex items-center justify-between bg-white/50 rounded-lg p-2">
                        <div>
                          <p className="text-sm font-medium text-sky-900">{student.name}</p>
                          <p className="text-xs text-sky-600">{student.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-sky-200 text-sky-700">
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Class Dialog */}
        <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
          <DialogContent className="bg-white/90 backdrop-blur-xl border-sky-200">
            <DialogHeader>
              <DialogTitle className="text-sky-900">Add New Class</DialogTitle>
              <DialogDescription>
                Create a new class to organize your students
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className" className="text-sm font-medium text-sky-800">Class Name</Label>
                  <Input
                    id="className"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-sky-800">Subject</Label>
                  <Input
                    id="subject"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm font-medium text-sky-800">Grade</Label>
                  <Input
                    id="grade"
                    value={newClass.grade}
                    onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher" className="text-sm font-medium text-sky-800">Teacher</Label>
                  <Input
                    id="teacher"
                    value={newClass.teacher}
                    onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule" className="text-sm font-medium text-sky-800">Schedule</Label>
                  <Input
                    id="schedule"
                    value={newClass.schedule}
                    onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room" className="text-sm font-medium text-sky-800">Room</Label>
                  <Input
                    id="room"
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-sky-800">Description</Label>
                <Textarea
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                  className="rounded-xl bg-white/70 border-sky-200 text-sky-900 backdrop-blur-sm"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddClassDialogOpen(false)}
                  className="border-sky-200 text-sky-700 hover:bg-sky-50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                  Create Class
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClassDashboard;
