import React, { useState } from 'react';
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
import { Calendar as CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CalendarIcon className="inline-block h-6 w-6 text-blue-500" /> Calendar</h2>
              <p className="text-gray-600">View all your project and task deadlines in one place.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200 flex flex-col items-center">
              <Calendar
                className="border-none shadow-none w-full max-w-lg rounded-xl calendar-animate"
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
              `}</style>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
              <p className="text-gray-600">Analyze your productivity and export project data.</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center text-gray-400">
              <p className="text-lg">(Reports and analytics coming soon!)</p>
            </div>
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

  return (
    <div className="flex h-screen bg-gray-50">
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
            }} disabled={!newProject.name || !newProject.endDate}>
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;