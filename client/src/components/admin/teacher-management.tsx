import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';

interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  qualifications?: string;
  subjects: Subject[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
}

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [assigningTeacher, setAssigningTeacher] = useState<Teacher | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    qualifications: '',
    subjects: [] as string[]
  });

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Map backend _id to frontend id and ensure subjects are properly mapped
      const mappedTeachers = data.map((teacher: any) => ({
        ...teacher,
        id: teacher._id || teacher.id,
        subjects: teacher.subjects ? teacher.subjects.map((subject: any) => ({
          ...subject,
          id: subject._id || subject.id
        })) : []
      }));
      setTeachers(mappedTeachers);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      // Set mock data for development
      setTeachers([
        {
          id: '1',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@school.edu',
          phone: '+1234567890',
          department: 'Mathematics',
          qualifications: 'PhD in Mathematics',
          subjects: [
            { id: '1', name: 'Calculus', code: 'MATH101' },
            { id: '2', name: 'Algebra', code: 'MATH102' }
          ],
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          fullName: 'Prof. Michael Brown',
          email: 'michael.brown@school.edu',
          phone: '+1234567891',
          department: 'Physics',
          qualifications: 'PhD in Physics',
          subjects: [
            { id: '3', name: 'Mechanics', code: 'PHYS101' }
          ],
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/admin/subjects', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([
        { id: '1', name: 'Calculus', code: 'MATH101', description: 'Advanced Calculus' },
        { id: '2', name: 'Algebra', code: 'MATH102', description: 'Linear Algebra' },
        { id: '3', name: 'Mechanics', code: 'PHYS101', description: 'Classical Mechanics' }
      ]);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTeacher)
      });

      if (response.ok) {
        setNewTeacher({ fullName: '', email: '', phone: '', department: '', qualifications: '', subjects: [] });
        setIsAddDialogOpen(false);
        fetchTeachers();
        alert('Teacher added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to add teacher: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to add teacher:', error);
      alert('Failed to add teacher. Please try again.');
    }
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      const response = await fetch(`/api/admin/teachers/${editingTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingTeacher)
      });

      if (response.ok) {
        setEditingTeacher(null);
        setIsEditDialogOpen(false);
        fetchTeachers();
        alert('Teacher updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update teacher: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update teacher:', error);
      alert('Failed to update teacher. Please try again.');
    }
  };

  const handleDeleteTeacher = async (teacherId: string, teacherName: string) => {
    if (window.confirm(`Are you sure you want to delete ${teacherName}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/admin/teachers/${teacherId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          fetchTeachers();
          alert(`${teacherName} has been deleted successfully.`);
        } else {
          const errorData = await response.json();
          alert(`Failed to delete teacher: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to delete teacher:', error);
        alert('Failed to delete teacher. Please try again.');
      }
    }
  };

  const handleAssignSubjects = async (teacherId: string, subjectIds: string[]) => {
    if (!teacherId) {
      alert('Invalid teacher ID');
      return;
    }

    console.log('Assigning subjects:', { teacherId, subjectIds });

    try {
      const response = await fetch(`/api/admin/teachers/${teacherId}/assign-subjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subjectIds })
      });

      if (response.ok) {
        console.log('Subjects assigned successfully, refreshing teacher data...');
        await fetchTeachers(); // Wait for refresh to complete
        alert('Subjects assigned successfully!');
      } else {
        const errorData = await response.json();
        console.error('Assignment failed:', errorData);
        alert(`Failed to assign subjects: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to assign subjects:', error);
      alert('Failed to assign subjects. Please try again.');
    }
  };

  const openAssignDialog = (teacher: Teacher) => {
    setAssigningTeacher(teacher);
    setSelectedSubjects(teacher.subjects.map(s => s._id || s.id));
    setIsAssignDialogOpen(true);
  };

  const handleAssignDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTeacher) {
      alert('Invalid teacher selected');
      return;
    }

    // Use _id if id is not available (backend returns _id)
    const teacherId = assigningTeacher.id || (assigningTeacher as any)._id;
    if (!teacherId) {
      alert('Invalid teacher ID');
      return;
    }

    try {
      await handleAssignSubjects(teacherId, selectedSubjects);
      setIsAssignDialogOpen(false);
      setAssigningTeacher(null);
      setSelectedSubjects([]);
    } catch (error) {
      console.error('Failed to assign subjects:', error);
      alert('Failed to assign subjects. Please try again.');
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.isActive).length;
  const totalSubjects = teachers.reduce((total, teacher) => total + teacher.subjects.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="space-y-8 p-6">
        {/* Hero Section with Teacher Stats */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 opacity-30 rounded-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-sky-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-sky-900">
                  Teacher Management
                </h1>
                <p className="text-sky-800 mt-2 text-lg">Manage teachers and their subject assignments</p>
              </div>
            </div>

            {/* Teacher Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <p className="text-sky-700 text-sm font-medium">Total Teachers</p>
                      <p className="text-3xl font-bold text-sky-900">{totalTeachers}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sky-700 text-sm">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    <span>Faculty members</span>
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
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-green-700 text-sm font-medium">Active Teachers</p>
                      <p className="text-3xl font-bold text-green-900">{activeTeachers}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-700 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Currently teaching</span>
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
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-purple-700 text-sm font-medium">Total Subjects</p>
                      <p className="text-3xl font-bold text-purple-900">{totalSubjects}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-700 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>Subject assignments</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-sky-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-600 w-4 h-4" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 border-sky-200 focus:border-sky-400"
              />
            </div>
            <Button variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white/90 border-sky-200 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-sky-900">Add New Teacher</DialogTitle>
                <DialogDescription className="text-sky-700">
                  Create a new teacher account and assign subjects.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTeacher} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sky-700">Full Name</Label>
                    <Input
                      id="fullName"
                      value={newTeacher.fullName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                      className="border-sky-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sky-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                      className="border-sky-200 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sky-700">Phone</Label>
                    <Input
                      id="phone"
                      value={newTeacher.phone}
                      onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                      className="border-sky-200 focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-sky-700">Department</Label>
                    <Input
                      id="department"
                      value={newTeacher.department}
                      onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                      className="border-sky-200 focus:border-sky-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="qualifications" className="text-sky-700">Qualifications</Label>
                  <Textarea
                    id="qualifications"
                    value={newTeacher.qualifications}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualifications: e.target.value })}
                    className="border-sky-200 focus:border-sky-400"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-sky-700">Assign Subjects</Label>
                  <Select onValueChange={(value) => {
                    if (!newTeacher.subjects.includes(value)) {
                      setNewTeacher({ ...newTeacher, subjects: [...newTeacher.subjects, value] });
                    }
                  }}>
                    <SelectTrigger className="border-sky-200 focus:border-sky-400">
                      <SelectValue placeholder="Select subjects to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newTeacher.subjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newTeacher.subjects.map(subjectId => {
                        const subject = subjects.find(s => s.id === subjectId);
                        return subject ? (
                          <Badge key={subjectId} className="bg-sky-100 text-sky-800">
                            {subject.name}
                            <button
                              type="button"
                              onClick={() => setNewTeacher({ 
                                ...newTeacher, 
                                subjects: newTeacher.subjects.filter(id => id !== subjectId) 
                              })}
                              className="ml-2 text-sky-600 hover:text-sky-800"
                            >
                              ×
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
                    Add Teacher
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 to-blue-500/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {teacher.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sky-900 text-lg">{teacher.fullName}</h3>
                      <p className="text-sky-700 text-sm">{teacher.email}</p>
                    </div>
                  </div>
                  <Badge className={`${teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {teacher.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  {teacher.phone && (
                    <div className="flex items-center text-sm text-sky-700">
                      <Phone className="w-4 h-4 mr-3 text-sky-600" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                  {teacher.department && (
                    <div className="flex items-center text-sm text-sky-700">
                      <GraduationCap className="w-4 h-4 mr-3 text-sky-600" />
                      <span>{teacher.department}</span>
                    </div>
                  )}
                  {teacher.qualifications && (
                    <div className="flex items-center text-sm text-sky-700">
                      <BookOpen className="w-4 h-4 mr-3 text-sky-600" />
                      <span className="truncate">{teacher.qualifications}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sky-900 text-sm mb-2">Subjects:</h4>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map(subject => (
                      <Badge key={subject.id} variant="outline" className="text-xs border-sky-200 text-sky-700">
                        {subject.name}
                      </Badge>
                    ))}
                    {teacher.subjects.length === 0 && (
                      <span className="text-xs text-sky-500">No subjects assigned</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-sky-200">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="border-sky-200 text-sky-700 hover:bg-sky-50">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-sky-200 text-sky-700 hover:bg-sky-50"
                      onClick={() => {
                        setEditingTeacher(teacher);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => openAssignDialog(teacher)}
                    >
                      <BookOpen className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTeacher(teacher.id, teacher.fullName)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-sky-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sky-700 mb-2">No teachers found</h3>
            <p className="text-sky-600">Try adjusting your search criteria or add a new teacher.</p>
          </div>
        )}

        {/* Subject Assignment Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-2xl bg-white/90 border-sky-200 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-sky-900">
                Assign Subjects to {assigningTeacher?.fullName}
              </DialogTitle>
              <DialogDescription className="text-sky-700">
                Select the subjects this teacher will teach.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssignDialogSubmit} className="space-y-6">
              <div>
                <Label className="text-sky-700">Available Subjects</Label>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {subjects.map(subject => {
                    const subjectId = subject._id || subject.id;
                    return (
                      <div key={subjectId} className="flex items-center space-x-3 p-3 bg-sky-50 rounded-lg">
                        <input
                          type="checkbox"
                          id={`subject-${subjectId}`}
                          checked={selectedSubjects.includes(subjectId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubjects([...selectedSubjects, subjectId]);
                            } else {
                              setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
                            }
                          }}
                          className="w-4 h-4 text-sky-600 border-sky-300 rounded focus:ring-sky-500"
                        />
                        <label htmlFor={`subject-${subjectId}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-sky-900">{subject.name}</div>
                          <div className="text-sm text-sky-600">{subject.code} - {subject.description}</div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700">
                  Assign Subjects
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeacherManagement;
