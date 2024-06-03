import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectsView } from './components/projects/ProjectsView';
import { TasksView } from './components/tasks/TasksView';
import { TeamView } from './components/team/TeamView';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { mockNotifications, mockProjects as initialMockProjects, mockTasks as initialMockTasks, mockUsers } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Calendar as CalendarIcon, Settings as SettingsIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [activeView, setActiveView] = useLocalStorage('activeView', 'dashboard');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [projects, setProjects] = useState(initialMockProjects);
  const [tasks, setTasks] = useState(initialMockTasks);
  // Form state
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'low', dueDate: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', priority: 'low', endDate: '' });
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({ name: mockUsers[0].name, email: mockUsers[0].email });
  const currentUser = mockUsers[0];
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { darkMode: false, notifications: true };
  });

  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
    // In a real app, this would show project details
    setActiveView('projects');
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    // In a real app, this would show task details
    setActiveView('tasks');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            onProjectClick={handleProjectClick}
            onTaskClick={handleTaskClick}
            onViewAllProjects={() => setActiveView('projects')}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            onProjectClick={handleProjectClick}
            onCreateProject={() => setShowCreateProject(true)}
          />
        );
      case 'tasks':
        return (
          <TasksView
            onTaskClick={handleTaskClick}
            onCreateTask={() => setShowCreateTask(true)}
          />
        );
      case 'team':
        return <TeamView />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-600">Stay updated with your team and projects</p>
            </div>
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><CalendarIcon className="inline-block h-6 w-6 text-blue-500" /> Calendar</h2>
              <p className="text-gray-600 dark:text-gray-300">View all your project and task deadlines in one place.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 flex flex-col items-center">
              <Calendar
                className="border-none shadow-none w-full max-w-lg rounded-xl calendar-animate bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                prev2Label={null}
                next2Label={null}
              />
              <style>{`
                .calendar-animate .react-calendar__tile {
                  transition: background 0.2s, transform 0.2s;
                  border-radius: 0.75rem;
                }
                .calendar-animate .react-calendar__tile--active {
                  background: #3b82f6 !important;
                  color: #fff;
                  border-radius: 0.75rem;
                }
                .calendar-animate .react-calendar__tile:enabled:hover, .calendar-animate .react-calendar__tile:enabled:focus {
                  background: #dbeafe;
                  color: #1e40af;
                  transform: scale(1.05);
                }
                .dark .calendar-animate .react-calendar__tile {
                  background: #18181b;
                  color: #e5e7eb;
                }
                .dark .calendar-animate .react-calendar__tile--active {
                  background: #2563eb !important;
                  color: #fff;
                }
                .dark .calendar-animate .react-calendar__tile:enabled:hover, .dark .calendar-animate .react-calendar__tile:enabled:focus {
                  background: #1e293b;
                  color: #60a5fa;
                }
              `}</style>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300">Analyze your productivity and export project data.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500">
              <p className="text-lg">(Reports and analytics coming soon!)</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-7 w-7 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); toast.success('Settings saved!'); }}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-blue-600' : ''}`}
                  onClick={() => setSettings((s: typeof settings) => ({ ...s, darkMode: !s.darkMode }))}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Enable Notifications</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${settings.notifications ? 'bg-blue-600' : ''}`}
                  onClick={() => setSettings((s: typeof settings) => ({ ...s, notifications: !s.notifications }))}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${settings.notifications ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
            <style>{`
              .animate-fade-in { animation: fadeIn 0.5s; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
            `}</style>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Coming soon...</p>
          </div>
        );
    }
  };

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  useEffect(() => {
    // Show toasts for upcoming deadlines (tasks due in next 3 days)
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    tasks.forEach(task => {
      const due = new Date(task.dueDate);
      if (due >= today && due <= threeDaysFromNow && task.status !== 'completed') {
        toast.custom(t => (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-lg animate-fade-in flex items-center gap-3">
            <span className="text-yellow-500 text-xl">⚠️</span>
            <div>
              <div className="font-semibold text-yellow-800">Upcoming Deadline</div>
              <div className="text-yellow-700 text-sm">{task.title} is due on {due.toLocaleDateString()}</div>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="ml-4 px-2 py-1 text-xs rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-800">Dismiss</button>
          </div>
        ), { duration: 6000 });
      }
    });
  }, [tasks]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        notificationCount={unreadNotifications}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onCreateTask={() => setShowCreateTask(true)}
          onCreateProject={() => setShowCreateProject(true)}
          notificationCount={unreadNotifications}
          onProfileClick={() => setShowProfile(true)}
          onNotificationsClick={() => setActiveView('notifications')}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        title="Create New Task"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title..."
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task description..."
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => { setShowCreateTask(false); setNewTask({ title: '', description: '', priority: 'low', dueDate: '' }); }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setTasks([
                ...tasks,
                {
                  id: (tasks.length + 1).toString(),
                  title: newTask.title,
                  description: newTask.description,
                  status: 'todo',
                  priority: newTask.priority as 'low' | 'medium' | 'high' | 'urgent',
                  assignee: mockUsers[0],
                  projectId: projects[0]?.id || '1',
                  dueDate: newTask.dueDate,
                  createdAt: new Date().toISOString(),
                  tags: [],
                  attachments: [],
                  comments: []
                }
              ]);
              setShowCreateTask(false);
              setNewTask({ title: '', description: '', priority: 'low', dueDate: '' });
              toast.success('Task created!');
            }} disabled={!newTask.title || !newTask.dueDate}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create New Project"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name..."
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Project description..."
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newProject.priority}
                onChange={e => setNewProject({ ...newProject, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newProject.endDate}
                onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => { setShowCreateProject(false); setNewProject({ name: '', description: '', priority: 'low', endDate: '' }); }}>
              Cancel
            </Button>
            <Button onClick={() => {
              setProjects([
                ...projects,
                {
                  id: (projects.length + 1).toString(),
                  name: newProject.name,
                  description: newProject.description,
                  status: 'active',
                  priority: newProject.priority as 'low' | 'medium' | 'high' | 'urgent',
                  progress: 0,
                  startDate: new Date().toISOString().slice(0, 10),
                  endDate: newProject.endDate,
                  team: [mockUsers[0]],
                  color: '#3B82F6',
                  tasksCount: 0,
                  completedTasks: 0
                }
              ]);
              setShowCreateProject(false);
              setNewProject({ name: '', description: '', priority: 'low', endDate: '' });
              toast.success('Project created!');
            }} disabled={!newProject.name || !newProject.endDate}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Profile Dashboard Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile Dashboard"
        size="md"
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-200 shadow-xl transition-transform duration-300 hover:scale-105"
            />
            <span className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white ${currentUser.status === 'online' ? 'bg-green-400' : currentUser.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'}`}></span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 hover:text-blue-600">{currentUser.name}</h3>
          <p className="text-gray-500">{currentUser.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium transition-all duration-200 hover:bg-blue-200">{currentUser.role}</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium transition-all duration-200 hover:bg-gray-200 capitalize">{currentUser.status}</span>
          </div>
          <div className="w-full mt-6">
            <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200" onClick={() => { setShowEditProfile(true); setShowProfile(false); }}>Edit Profile</button>
            <button className="w-full py-2 mt-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition-all duration-200" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
        <style>{`
          .animate-fade-in {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
        size="sm"
      >
        <form className="space-y-6 animate-fade-in" onSubmit={e => { e.preventDefault(); setShowEditProfile(false); }}>
          <div className="flex flex-col items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={editProfile.name}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-200 shadow-md mb-2"
            />
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-lg"
              value={editProfile.name}
              onChange={e => setEditProfile({ ...editProfile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              value={editProfile.email}
              onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowEditProfile(false)} type="button">Cancel</Button>
            <Button type="submit" disabled={!editProfile.name || !editProfile.email}>Save</Button>
          </div>
        </form>
        <style>{`
          .animate-fade-in {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </Modal>

      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </div>
  );
}

export default App;