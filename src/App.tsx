import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { 
  Bell, 
  Plus, 
  Calendar as CalendarIcon, 
  X, 
  Save, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Users,
  FolderKanban,
  CheckSquare,
  Clock,
  Target,
  Award,
  Zap
} from 'lucide-react';
import Calendar from 'react-calendar';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Import components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { TeamView } from './components/team/TeamView';
import { ReportsView } from './components/reports/ReportsView';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Avatar } from './components/ui/Avatar';
import { Modal } from './components/ui/Modal';

// Import data and types
import { mockProjects, mockTasks, mockUsers, mockNotifications } from './data/mockData';
import { Project, Task, User, Notification } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', mockNotifications);
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    project: '',
    dueDate: '',
    tags: []
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    team: [],
    color: '#3B82F6'
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    company: 'TechCorp Inc.',
    role: 'Product Manager',
    bio: 'Passionate about creating amazing user experiences and leading high-performing teams.'
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCreateTask = () => {
    console.log('Creating task:', taskForm);
    setShowCreateTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      project: '',
      dueDate: '',
      tags: []
    });
  };

  const handleCreateProject = () => {
    console.log('Creating project:', projectForm);
    setShowCreateProjectModal(false);
    setProjectForm({
      name: '',
      description: '',
      priority: 'medium',
      startDate: '',
      endDate: '',
      team: [],
      color: '#3B82F6'
    });
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileForm);
    setShowProfile(false);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Project Management Report', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Projects table
    const projectData = mockProjects.map(project => [
      project.name,
      project.status,
      project.priority,
      `${project.progress}%`,
      project.team.length.toString()
    ]);
    
    (doc as any).autoTable({
      head: [['Project', 'Status', 'Priority', 'Progress', 'Team Size']],
      body: projectData,
      startY: 50,
      theme: 'grid'
    });
    
    // Tasks table
    const taskData = mockTasks.map(task => [
      task.title,
      task.status,
      task.priority,
      task.assignee.name,
      new Date(task.dueDate).toLocaleDateString()
    ]);
    
    (doc as any).autoTable({
      head: [['Task', 'Status', 'Priority', 'Assignee', 'Due Date']],
      body: taskData,
      startY: (doc as any).lastAutoTable.finalY + 20,
      theme: 'grid'
    });
    
    doc.save('project-report.pdf');
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const userOptions = mockUsers.map(user => ({
    value: user.id,
    label: user.name
  }));

  const projectOptions = mockProjects.map(project => ({
    value: project.id,
    label: project.name
  }));

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onProjectClick={(id) => console.log('Project clicked:', id)}
            onTaskClick={(id) => console.log('Task clicked:', id)}
            onViewAllProjects={() => setActiveView('projects')}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            onProjectClick={(id) => console.log('Project clicked:', id)}
            onCreateProject={() => setShowCreateProjectModal(true)}
          />
        );
      case 'tasks':
        return (
          <TasksView
            onTaskClick={(id) => console.log('Task clicked:', id)}
            onCreateTask={() => setShowCreateTaskModal(true)}
          />
        );
      case 'team':
        return <TeamView />;
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h2>
                <p className="text-gray-600 dark:text-gray-300">View and manage your schedule</p>
              </div>
              <Button icon={Plus} onClick={() => setShowCreateTaskModal(true)}>
                New Event
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="w-full border-none"
                  />
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    {mockTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return <ReportsView onExportPDF={exportToPDF} />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                <p className="text-gray-600 dark:text-gray-300">Stay updated with your latest activities</p>
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all duration-200 ${
                    !notification.read 
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'task_assigned' ? 'bg-blue-100 dark:bg-blue-900' :
                      notification.type === 'deadline_approaching' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      notification.type === 'task_completed' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Bell className={`h-5 w-5 ${
                        notification.type === 'task_assigned' ? 'text-blue-600 dark:text-blue-400' :
                        notification.type === 'deadline_approaching' ? 'text-yellow-600 dark:text-yellow-400' :
                        notification.type === 'task_completed' ? 'text-green-600 dark:text-green-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{notification.message}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
                <p className="text-gray-600 dark:text-gray-300">You're all caught up!</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage your preferences and account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Toggle dark mode theme</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Receive notifications via email</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</label>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Receive push notifications</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start">
                      Export Data
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Import Data
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Reset Settings
                    </Button>
                    <Button variant="danger" className="w-full justify-start">
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onProjectClick={(id) => console.log('Project clicked:', id)} onTaskClick={(id) => console.log('Task clicked:', id)} onViewAllProjects={() => setActiveView('projects')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        notificationCount={unreadCount}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onCreateTask={() => setShowCreateTaskModal(true)}
          onCreateProject={() => setShowCreateProjectModal(true)}
          notificationCount={unreadCount}
          onProfileClick={() => setShowProfile(true)}
          onNotificationsClick={() => setShowNotifications(true)}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter task title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter task description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <Select
                value={priorityOptions.find(option => option.value === taskForm.priority)}
                onChange={(option) => setTaskForm({ ...taskForm, priority: option?.value || 'medium' })}
                options={priorityOptions}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignee
              </label>
              <Select
                value={userOptions.find(option => option.value === taskForm.assignee)}
                onChange={(option) => setTaskForm({ ...taskForm, assignee: option?.value || '' })}
                options={userOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select assignee..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <Select
                value={projectOptions.find(option => option.value === taskForm.project)}
                onChange={(option) => setTaskForm({ ...taskForm, project: option?.value || '' })}
                options={projectOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select project..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateTaskModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        title="Create New Project"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter project name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Enter project description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <Select
                value={priorityOptions.find(option => option.value === projectForm.priority)}
                onChange={(option) => setProjectForm({ ...projectForm, priority: option?.value || 'medium' })}
                options={priorityOptions}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Color
              </label>
              <input
                type="color"
                value={projectForm.color}
                onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Members
            </label>
            <Select
              isMulti
              value={userOptions.filter(option => projectForm.team.includes(option.value))}
              onChange={(options) => setProjectForm({ ...projectForm, team: options?.map(option => option.value) || [] })}
              options={userOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select team members..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar
              src={mockUsers[0].avatar}
              alt={mockUsers[0].name}
              size="xl"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profileForm.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{profileForm.role}</p>
              <Button variant="ghost" size="sm" className="mt-2">
                Change Photo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <UserIcon className="inline h-4 w-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Company
              </label>
              <input
                type="text"
                value={profileForm.company}
                onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="inline h-4 w-4 mr-1" />
                Role
              </label>
              <input
                type="text"
                value={profileForm.role}
                onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowProfile(false)}>
              Cancel
            </Button>
            <Button icon={Save} onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;