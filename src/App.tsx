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
import { Calendar as CalendarIcon, Settings as SettingsIcon, Plus, Filter as FilterIcon, User as UserIcon, FolderKanban as FolderIcon, ListChecks as StatusIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast, { Toaster } from 'react-hot-toast';
import { Task, Project } from './types';

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

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarModalTasks, setCalendarModalTasks] = useState<Task[]>([]);
  const [calendarModalProjects, setCalendarModalProjects] = useState<Project[]>([]);
  const [calendarFilter, setCalendarFilter] = useState({ project: 'all', user: 'all', status: 'all' });
  const [showCalendarCreate, setShowCalendarCreate] = useState(false);
  const [calendarCreateType, setCalendarCreateType] = useState<'task' | 'project'>('task');
  const [calendarCreateDate, setCalendarCreateDate] = useState<string | null>(null);

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
        const deadlineDates = getAllDeadlineDates();
        return (
          <div className="space-y-10 animate-fade-in max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2"><CalendarIcon className="inline-block h-8 w-8 text-blue-500 animate-pop" /> Calendar</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">View all your project and task deadlines in one place.</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1">
                  <FolderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select value={calendarFilter.project} onChange={e => setCalendarFilter(f => ({ ...f, project: e.target.value }))} className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="all">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select value={calendarFilter.user} onChange={e => setCalendarFilter(f => ({ ...f, user: e.target.value }))} className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="all">All Users</option>
                    {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select value={calendarFilter.status} onChange={e => setCalendarFilter(f => ({ ...f, status: e.target.value }))} className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <option value="all">All Statuses</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="active">Active</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl p-12 border border-gray-200 dark:border-gray-800 flex flex-col items-center overflow-hidden calendar-bg-gradient shadow-xl min-h-[600px]">
              <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-pink-100/30 dark:from-blue-900/40 dark:via-purple-900/30 dark:to-pink-900/20 animate-gradient-move" />
              <button
                className="absolute top-8 right-8 flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all animate-bounce hover:scale-105 focus:outline-none z-10 text-base font-semibold"
                onClick={() => { setShowCalendarCreate(true); setCalendarCreateType('task'); setCalendarCreateDate(null); }}
              >
                <Plus className="h-5 w-5 animate-pop" /> Add Task/Project
              </button>
              <Calendar
                className="border-none shadow-none w-full max-w-3xl rounded-2xl calendar-animate bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate-fade-in"
                prev2Label={null}
                next2Label={null}
                value={calendarDate}
                onClickDay={date => {
                  setCalendarDate(date);
                  const { tasks, projects } = getDeadlinesForDate(date);
                  setCalendarModalTasks(tasks);
                  setCalendarModalProjects(projects);
                  setCalendarModalOpen(true);
                }}
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  const dateStr = date.toISOString().slice(0, 10);
                  const isToday = new Date().toISOString().slice(0, 10) === dateStr;
                  const { tasks, projects } = getDeadlinesForDate(date);
                  if (tasks.length === 0 && projects.length === 0) return isToday ? <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mt-2 animate-glow" /> : null;
                  // Show colored dots for tasks/projects
                  return (
                    <div className="flex justify-center gap-1 mt-2">
                      {tasks.length > 0 && <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse-slow shadow-lg shadow-yellow-200 dark:shadow-yellow-900" title={`${tasks.length} task(s)`} />}
                      {projects.length > 0 && <span className="w-3 h-3 rounded-full bg-green-400 animate-bounce shadow-lg shadow-green-200 dark:shadow-green-900" title={`${projects.length} project(s)`} />}
                      {isToday && <span className="w-3 h-3 rounded-full bg-blue-500 animate-glow" title="Today" />}
                    </div>
                  );
                }}
                tileClassName={({ date, view }) => {
                  if (view !== 'month') return '';
                  const dateStr = date.toISOString().slice(0, 10);
                  const { tasks, projects } = getDeadlinesForDate(date);
                  const isSoon = tasks.some(t => {
                    const due = new Date(t.dueDate);
                    const now = new Date();
                    return due >= now && due <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) && t.status !== 'completed';
                  });
                  const isOverdue = tasks.some(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');
                  const isToday = new Date().toISOString().slice(0, 10) === dateStr;
                  let base = 'transition-all duration-200 text-lg font-semibold py-6';
                  if (isOverdue) base += ' ring-2 ring-red-400 animate-shake';
                  else if (isSoon) base += ' ring-2 ring-yellow-400 animate-pulse-fast';
                  if (isToday) base += ' animate-glow-tile';
                  return base;
                }}
                tileDisabled={({ date }) => false}
              />
              <style>{`
                .calendar-bg-gradient { background: transparent; }
                .animate-gradient-move {
                  animation: gradientMove 8s ease-in-out infinite alternate;
                }
                @keyframes gradientMove {
                  0% { filter: blur(0px) brightness(1); opacity: 0.7; }
                  100% { filter: blur(4px) brightness(1.1); opacity: 1; }
                }
                .animate-fade-in { animation: fadeIn 0.7s; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
                .animate-pop { animation: pop 0.4s cubic-bezier(.36,1.56,.64,1) both; }
                @keyframes pop { 0% { transform: scale(0.7); } 80% { transform: scale(1.15); } 100% { transform: scale(1); } }
                .animate-bounce { animation: bounce 1.2s infinite alternate; }
                @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
                .animate-pulse-slow { animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .animate-pulse-fast { animation: pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .animate-glow { animation: glow 1.5s infinite alternate; box-shadow: 0 0 12px 3px #3b82f6; }
                @keyframes glow { 0% { box-shadow: 0 0 12px 3px #3b82f6; } 100% { box-shadow: 0 0 24px 6px #2563eb; } }
                .animate-glow-tile { animation: glowTile 1.5s infinite alternate; }
                @keyframes glowTile { 0% { box-shadow: 0 0 0 0 #3b82f6; } 100% { box-shadow: 0 0 20px 4px #2563eb; } }
                .calendar-animate .react-calendar__tile {
                  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
                  border-radius: 1.25rem;
                  position: relative;
                  min-height: 64px;
                  margin: 6px;
                  font-size: 1.15rem;
                  padding: 0.5rem 0.25rem;
                }
                .calendar-animate .react-calendar__month-view {
                  gap: 1.5rem;
                }
                .calendar-animate .react-calendar__tile--active {
                  background: #3b82f6 !important;
                  color: #fff;
                  border-radius: 1.25rem;
                  transform: scale(1.10);
                  box-shadow: 0 4px 32px 0 #3b82f6cc;
                  z-index: 2;
                }
                .calendar-animate .react-calendar__tile:enabled:hover, .calendar-animate .react-calendar__tile:enabled:focus {
                  background: #dbeafe;
                  color: #1e40af;
                  transform: scale(1.08);
                  box-shadow: 0 2px 16px 0 #60a5fa55;
                  z-index: 1;
                }
                .dark .calendar-bg-gradient { background: transparent; }
                .dark .animate-gradient-move { }
                .dark .calendar-animate .react-calendar__tile {
                  background: #18181b;
                  color: #e5e7eb;
                }
                .dark .calendar-animate .react-calendar__tile--active {
                  background: #2563eb !important;
                  color: #fff;
                  box-shadow: 0 4px 32px 0 #2563ebcc;
                }
                .dark .calendar-animate .react-calendar__tile:enabled:hover, .dark .calendar-animate .react-calendar__tile:enabled:focus {
                  background: #1e293b;
                  color: #60a5fa;
                  box-shadow: 0 2px 16px 0 #60a5fa55;
                }
              `}</style>
            </div>

            {/* Calendar Day Modal */}
            <Modal
              isOpen={calendarModalOpen}
              onClose={() => setCalendarModalOpen(false)}
              title={`Deadlines for ${calendarDate.toLocaleDateString()}`}
              size="lg"
            >
              <div className="space-y-4">
                {calendarModalTasks.length === 0 && calendarModalProjects.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400">No tasks or projects due on this day.</div>
                )}
                {calendarModalTasks.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Tasks</h4>
                    <ul className="space-y-2">
                      {calendarModalTasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{task.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{task.description}</div>
                            <div className="text-xs mt-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 mr-2">{task.status}</span>
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{task.priority}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Button size="sm" variant="secondary" onClick={() => { setSelectedTask(task.id); setActiveView('tasks'); setCalendarModalOpen(false); }}>View</Button>
                            <Button size="sm" variant="primary" onClick={() => { setTasks(ts => ts.map(t => t.id === task.id ? { ...t, status: 'completed' } : t)); }}>Mark Complete</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {calendarModalProjects.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Projects</h4>
                    <ul className="space-y-2">
                      {calendarModalProjects.map(project => (
                        <li key={project.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{project.description}</div>
                            <div className="text-xs mt-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 mr-2">{project.status}</span>
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">{project.priority}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Button size="sm" variant="secondary" onClick={() => { setSelectedProject(project.id); setActiveView('projects'); setCalendarModalOpen(false); }}>View</Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Modal>

            {/* Calendar Quick Create Modal */}
            <Modal
              isOpen={showCalendarCreate}
              onClose={() => setShowCalendarCreate(false)}
              title={`Create New ${calendarCreateType === 'task' ? 'Task' : 'Project'}`}
              size="md"
            >
              <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                if (calendarCreateType === 'task') {
                  setTasks(ts => [
                    ...ts,
                    {
                      id: (tasks.length + 1).toString(),
                      title: newTask.title,
                      description: newTask.description,
                      priority: newTask.priority,
                      dueDate: calendarCreateDate || new Date().toISOString().slice(0, 10),
                      status: 'todo',
                      assignee: mockUsers[0],
                      tags: [],
                      comments: [],
                      attachments: [],
                      projectId: projects[0]?.id || '1',
                      createdAt: new Date().toISOString().slice(0, 10),
                    } as Task
                  ]);
                  setShowCalendarCreate(false);
                  setNewTask({ title: '', description: '', priority: 'low', dueDate: '' });
                  toast.success('Task created!');
                } else {
                  setProjects(ps => [
                    ...ps,
                    {
                      id: (projects.length + 1).toString(),
                      name: newProject.name,
                      description: newProject.description,
                      status: 'active',
                      priority: newProject.priority as 'low' | 'medium' | 'high' | 'urgent',
                      progress: 0,
                      startDate: new Date().toISOString().slice(0, 10),
                      endDate: calendarCreateDate || new Date().toISOString().slice(0, 10),
                      team: [mockUsers[0]],
                      color: '#3B82F6',
                      tasksCount: 0,
                      completedTasks: 0
                    }
                  ]);
                  setShowCalendarCreate(false);
                  setNewProject({ name: '', description: '', priority: 'low', endDate: '' });
                  toast.success('Project created!');
                }
              }}>
                <div className="flex gap-2 mb-2">
                  <Button type="button" variant={calendarCreateType === 'task' ? 'primary' : 'secondary'} onClick={() => setCalendarCreateType('task')}>Task</Button>
                  <Button type="button" variant={calendarCreateType === 'project' ? 'primary' : 'secondary'} onClick={() => setCalendarCreateType('project')}>Project</Button>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={calendarCreateType === 'task' ? newTask.title : newProject.name}
                  onChange={e => calendarCreateType === 'task' ? setNewTask(nt => ({ ...nt, title: e.target.value })) : setNewProject(np => ({ ...np, name: e.target.value }))}
                  placeholder={calendarCreateType === 'task' ? 'Task Title' : 'Project Name'}
                  required
                />
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={calendarCreateType === 'task' ? newTask.description : newProject.description}
                  onChange={e => calendarCreateType === 'task' ? setNewTask(nt => ({ ...nt, description: e.target.value })) : setNewProject(np => ({ ...np, description: e.target.value }))}
                  placeholder={calendarCreateType === 'task' ? 'Task Description' : 'Project Description'}
                  required
                />
                <div className="flex gap-2">
                  <select
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={calendarCreateType === 'task' ? newTask.priority : newProject.priority}
                    onChange={e => calendarCreateType === 'task' ? setNewTask(nt => ({ ...nt, priority: e.target.value })) : setNewProject(np => ({ ...np, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <input
                    type="date"
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    value={calendarCreateDate || ''}
                    onChange={e => setCalendarCreateDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit">Create {calendarCreateType === 'task' ? 'Task' : 'Project'}</Button>
                </div>
              </form>
            </Modal>
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

  // Helper: get all deadlines for a date (filtered)
  const getDeadlinesForDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    let filteredTasks = tasks.filter(t => t.dueDate === dateStr);
    let filteredProjects = projects.filter(p => p.endDate === dateStr);
    if (calendarFilter.project !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.projectId === calendarFilter.project);
      filteredProjects = filteredProjects.filter(p => p.id === calendarFilter.project);
    }
    if (calendarFilter.user !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.assignee.id === calendarFilter.user);
      filteredProjects = filteredProjects.filter(p => p.team.some(u => u.id === calendarFilter.user));
    }
    if (calendarFilter.status !== 'all') {
      filteredTasks = filteredTasks.filter(t => t.status === calendarFilter.status);
      filteredProjects = filteredProjects.filter(p => p.status === calendarFilter.status);
    }
    return { tasks: filteredTasks, projects: filteredProjects };
  };

  // Helper: get all dates with deadlines (filtered)
  const getAllDeadlineDates = () => {
    let allDates = new Set();
    tasks.forEach(t => {
      if (
        (calendarFilter.project === 'all' || t.projectId === calendarFilter.project) &&
        (calendarFilter.user === 'all' || t.assignee.id === calendarFilter.user) &&
        (calendarFilter.status === 'all' || t.status === calendarFilter.status)
      ) {
        allDates.add(t.dueDate);
      }
    });
    projects.forEach(p => {
      if (
        (calendarFilter.project === 'all' || p.id === calendarFilter.project) &&
        (calendarFilter.user === 'all' || p.team.some(u => u.id === calendarFilter.user)) &&
        (calendarFilter.status === 'all' || p.status === calendarFilter.status)
      ) {
        allDates.add(p.endDate);
      }
    });
    return Array.from(allDates);
  };

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