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
import { Calendar as CalendarIcon, Settings as SettingsIcon, Plus, Filter as FilterIcon, User as UserIcon, FolderKanban as FolderIcon, ListChecks as StatusIcon, BarChart2, PieChart, FileDown, ListChecks } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import toast, { Toaster } from 'react-hot-toast';
import { Task, Project } from './types';
import Select from 'react-select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  // Notifications state
  const [notifications, setNotifications] = useState(mockNotifications);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const playNotifSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarModalTasks, setCalendarModalTasks] = useState<Task[]>([]);
  const [calendarModalProjects, setCalendarModalProjects] = useState<Project[]>([]);
  const [calendarFilter, setCalendarFilter] = useState({ project: [] as string[], user: [] as string[], status: [] as string[] });
  const [showCalendarCreate, setShowCalendarCreate] = useState(false);
  const [calendarCreateType, setCalendarCreateType] = useState<'task' | 'project'>('task');
  const [calendarCreateDate, setCalendarCreateDate] = useState<string | null>(null);
  const [calendarFadeKey, setCalendarFadeKey] = useState(0);

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
            <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae1c3.mp3" preload="auto" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <p className="text-gray-600">Stay updated with your team and projects</p>
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md relative ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200 animate-float'
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
                    <div className="flex flex-col items-end gap-2">
                      {!notification.read && (
                        <>
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          <Button size="sm" variant="secondary" onClick={() => {
                            setNotifications(ns => ns.map(n => n.id === notification.id ? { ...n, read: true } : n));
                            playNotifSound();
                          }}>
                            Mark as Read
                          </Button>
                        </>
                      )}
                      {notification.read && (
                        <Button size="sm" variant="ghost" onClick={() => {
                          setNotifications(ns => ns.map(n => n.id === notification.id ? { ...n, read: false } : n));
                          playNotifSound();
                        }}>
                          Mark as Unread
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <style>{`
              @keyframes float {
                0% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
                100% { transform: translateY(0); }
              }
              .animate-float { animation: float 2.2s ease-in-out infinite; }
            `}</style>
          </div>
        );
      case 'calendar':
        const deadlineDates = getAllDeadlineDates();
        // react-select options
        const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));
        const userOptions = mockUsers.map(u => ({ value: u.id, label: u.name }));
        const statusOptions = [
          { value: 'todo', label: 'To Do' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'review', label: 'Review' },
          { value: 'completed', label: 'Completed' },
          { value: 'active', label: 'Active' },
          { value: 'on-hold', label: 'On Hold' },
        ];
        // react-select theme for dark mode
        const selectTheme = (theme: any) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: '#dbeafe',
            primary: '#3b82f6',
            neutral0: document.documentElement.classList.contains('dark') ? '#18181b' : '#fff',
            neutral80: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1e293b',
            neutral20: document.documentElement.classList.contains('dark') ? '#374151' : '#d1d5db',
            neutral30: document.documentElement.classList.contains('dark') ? '#4b5563' : '#9ca3af',
          },
        });
        // react-select styles for spacing
        const selectStyles = {
          control: (base: any) => ({ ...base, minHeight: 44, boxShadow: 'none', borderColor: '#d1d5db', background: document.documentElement.classList.contains('dark') ? '#18181b' : '#fff' }),
          menu: (base: any) => ({ ...base, zIndex: 100 }),
          multiValue: (base: any) => ({ ...base, background: '#3b82f6', color: '#fff', borderRadius: 6, padding: '0 4px' }),
          multiValueLabel: (base: any) => ({ ...base, color: '#fff', fontWeight: 500 }),
          multiValueRemove: (base: any) => ({ ...base, color: '#fff', ':hover': { background: '#2563eb', color: '#fff' } }),
        };
        return (
          <div key={calendarFadeKey} className="space-y-10 animate-fade-in max-w-5xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2"><CalendarIcon className="inline-block h-8 w-8 text-blue-500 animate-pop" /> Calendar</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">View all your project and task deadlines in one place.</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800">
                {/* Advanced MultiSelect Project Filter */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <FolderIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    isMulti
                    options={projectOptions}
                    value={projectOptions.filter(o => calendarFilter.project.includes(o.value))}
                    onChange={opts => setCalendarFilter(f => ({ ...f, project: (opts as any[]).map(o => o.value) }))}
                    placeholder="Projects..."
                    classNamePrefix="react-select"
                    theme={selectTheme}
                    styles={selectStyles}
                  />
                </div>
                {/* Advanced MultiSelect User Filter */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    isMulti
                    options={userOptions}
                    value={userOptions.filter(o => calendarFilter.user.includes(o.value))}
                    onChange={opts => setCalendarFilter(f => ({ ...f, user: (opts as any[]).map(o => o.value) }))}
                    placeholder="Users..."
                    classNamePrefix="react-select"
                    theme={selectTheme}
                    styles={selectStyles}
                  />
                </div>
                {/* Advanced MultiSelect Status Filter */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <StatusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Select
                    isMulti
                    options={statusOptions}
                    value={statusOptions.filter(o => calendarFilter.status.includes(o.value))}
                    onChange={opts => setCalendarFilter(f => ({ ...f, status: (opts as any[]).map(o => o.value) }))}
                    placeholder="Status..."
                    classNamePrefix="react-select"
                    theme={selectTheme}
                    styles={selectStyles}
                  />
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
        // Mock stats
        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.status === 'completed').length;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;
        const archivedProjects = projects.filter(p => p.status === 'archived').length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;
        const reviewTasks = tasks.filter(t => t.status === 'review').length;
        // Trends (mocked)
        const projectGrowth = '+3 this month';
        const taskCompletionRate = ((completedTasks / totalTasks) * 100 || 0).toFixed(1) + '%';
        // Mock chart data
        const barData = [
          { label: 'Completed', value: completedTasks },
          { label: 'In Progress', value: inProgressTasks },
          { label: 'To Do', value: todoTasks },
          { label: 'Review', value: reviewTasks },
          { label: 'Overdue', value: overdueTasks },
        ];
        const pieData = [
          { label: 'Completed', value: completedProjects },
          { label: 'Active', value: activeProjects },
          { label: 'On Hold', value: onHoldProjects },
          { label: 'Archived', value: archivedProjects },
        ];
        // Animated counter helper
        interface AnimatedCounterProps {
          value: number;
          duration?: number;
          className?: string;
        }
        const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1200, className = '' }) => {
          const [count, setCount] = React.useState(0);
          React.useEffect(() => {
            let start = 0;
            const step = Math.ceil(value / (duration / 16));
            const interval = setInterval(() => {
              start += step;
              if (start >= value) {
                setCount(value);
                clearInterval(interval);
              } else {
                setCount(start);
              }
            }, 16);
            return () => clearInterval(interval);
          }, [value, duration]);
          return <span className={className}>{count}</span>;
        };
        // PDF Export logic
        // @ts-ignore
        const handleExportPDF = () => {
          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text('Project Management Report', 14, 18);
          doc.setFontSize(12);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
          doc.text('Summary', 14, 36);
          // @ts-ignore
          doc.autoTable({
            startY: 40,
            head: [['Metric', 'Value']],
            body: [
              ['Total Projects', totalProjects],
              ['Completed Projects', completedProjects],
              ['Active Projects', activeProjects],
              ['On Hold Projects', onHoldProjects],
              ['Archived Projects', archivedProjects],
              ['Total Tasks', totalTasks],
              ['Completed Tasks', completedTasks],
              ['In Progress Tasks', inProgressTasks],
              ['To Do Tasks', todoTasks],
              ['Review Tasks', reviewTasks],
              ['Overdue Tasks', overdueTasks],
              ['Task Completion Rate', taskCompletionRate],
            ],
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10 },
          });
          // @ts-ignore
          const lastY1 = doc.lastAutoTable ? doc.lastAutoTable.finalY : 60;
          doc.text('Project Breakdown', 14, lastY1 + 10);
          // @ts-ignore
          doc.autoTable({
            startY: lastY1 + 14,
            head: [['Name', 'Status', 'Progress', 'End Date', 'Team']],
            body: projects.map(p => [p.name, p.status, `${p.progress}%`, p.endDate, p.team.map(u => u.name).join(', ')]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [16, 185, 129] },
          });
          // @ts-ignore
          const lastY2 = doc.lastAutoTable ? doc.lastAutoTable.finalY : lastY1 + 34;
          doc.text('Task Breakdown', 14, lastY2 + 10);
          // @ts-ignore
          doc.autoTable({
            startY: lastY2 + 14,
            head: [['Title', 'Status', 'Priority', 'Due Date', 'Assigned']],
            body: tasks.map(t => [t.title, t.status, t.priority, t.dueDate, t.assignee ? t.assignee.name : 'Unassigned']),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [239, 68, 68] },
          });
          doc.save('project_report.pdf');
        };
        return (
          <div className="space-y-10 max-w-5xl mx-auto animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2 animate-pop"><BarChart2 className="h-7 w-7 text-blue-500 animate-bounce" /> Reports & Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300">Analyze your productivity and export project data.</p>
            </div>
            {/* Animated Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center animate-fade-in-up">
                <span className="text-2xl font-bold text-blue-600"><AnimatedCounter value={totalProjects} /></span>
                <span className="text-gray-700 dark:text-gray-200 mt-1">Total Projects</span>
                <span className="text-xs text-green-500 mt-2 animate-pulse">{projectGrowth}</span>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center animate-fade-in-up delay-100">
                <span className="text-2xl font-bold text-green-600"><AnimatedCounter value={completedTasks} /></span>
                <span className="text-gray-700 dark:text-gray-200 mt-1">Completed Tasks</span>
                <span className="text-xs text-blue-500 mt-2 animate-pulse">{taskCompletionRate} done</span>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center animate-fade-in-up delay-200">
                <span className="text-2xl font-bold text-yellow-600"><AnimatedCounter value={inProgressTasks} /></span>
                <span className="text-gray-700 dark:text-gray-200 mt-1">In Progress</span>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center animate-fade-in-up delay-300">
                <span className="text-2xl font-bold text-red-600"><AnimatedCounter value={overdueTasks} /></span>
                <span className="text-gray-700 dark:text-gray-200 mt-1">Overdue Tasks</span>
              </div>
            </div>
            {/* Analytics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4"><BarChart2 className="h-5 w-5 text-blue-500 animate-bounce" /><span className="font-semibold text-gray-900 dark:text-white">Task Status Breakdown</span></div>
                <div className="flex items-end gap-6 h-48 justify-center">
                  {(() => {
                    const maxValue = Math.max(...barData.map(d => d.value), 1);
                    const minBarHeight = 10;
                    const maxBarHeight = 140;
                    return barData.map((d, i) => {
                      // Gradient colors for each bar
                      const gradients = [
                        'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)', // green
                        'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)', // blue
                        'linear-gradient(180deg, #fde68a 0%, #fbbf24 100%)', // yellow
                        'linear-gradient(180deg, #f9a8d4 0%, #ec4899 100%)', // pink
                        'linear-gradient(180deg, #fca5a5 0%, #ef4444 100%)', // red
                      ];
                      // Height proportional to max value
                      const height = d.value === 0 ? minBarHeight : Math.max(minBarHeight, (d.value / maxValue) * maxBarHeight);
                      return (
                        <div key={d.label} className="flex flex-col items-center group relative">
                          <div
                            className={`w-12 rounded-t-2xl transition-all duration-700 group-hover:scale-110 group-hover:shadow-2xl animate-grow-bar`}
                            style={{
                              height: `${height}px`,
                              background: gradients[i],
                              animationDelay: `${i * 0.15}s`,
                              boxShadow: '0 4px 24px 0 rgba(59,130,246,0.08)',
                            }}
                            title={String(d.value)}
                          />
                          <span className="mt-2 text-sm text-gray-700 dark:text-gray-200">{d.label}</span>
                          <span className="text-xs text-gray-500">{d.value}</span>
                          {/* Tooltip */}
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {d.label}: {d.value}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              {/* Circular Heatmap for Project Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 animate-fade-in-up delay-200">
                <div className="flex items-center gap-2 mb-4"><PieChart className="h-5 w-5 text-pink-500" /><span className="font-semibold text-gray-900 dark:text-white">Project Status Breakdown</span></div>
                <div className="flex flex-col items-center">
                  {(() => {
                    const [hovered, setHovered] = React.useState<number | null>(null);
                    const [labelPos, setLabelPos] = React.useState<{ x: number; y: number } | null>(null);
                    const total = pieData.reduce((sum, d) => sum + d.value, 0);
                    let acc = 0;
                    // Gradients for each segment
                    const gradients = [
                      'url(#pie-green)',
                      'url(#pie-blue)',
                      'url(#pie-yellow)',
                      'url(#pie-pink)',
                    ];
                    // SVG donut with gradients and expansion on hover
                    return (
                      <div className="relative flex flex-col items-center">
                        <svg viewBox="0 0 60 60" className="w-56 h-56 drop-shadow-2xl">
                          <defs>
                            <radialGradient id="pie-green" cx="50%" cy="50%" r="80%">
                              <stop offset="0%" stopColor="#bbf7d0" />
                              <stop offset="100%" stopColor="#22c55e" />
                            </radialGradient>
                            <radialGradient id="pie-blue" cx="50%" cy="50%" r="80%">
                              <stop offset="0%" stopColor="#dbeafe" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </radialGradient>
                            <radialGradient id="pie-yellow" cx="50%" cy="50%" r="80%">
                              <stop offset="0%" stopColor="#fef9c3" />
                              <stop offset="100%" stopColor="#fbbf24" />
                            </radialGradient>
                            <radialGradient id="pie-pink" cx="50%" cy="50%" r="80%">
                              <stop offset="0%" stopColor="#fce7f3" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </radialGradient>
                          </defs>
                          {pieData.map((d, i) => {
                            const start = acc / total * 100;
                            acc += d.value;
                            const end = acc / total * 100;
                            const large = end - start > 50 ? 1 : 0;
                            // Donut radii
                            const rOuter = hovered === i ? 27 : 25;
                            const rInner = 15;
                            // Arc math
                            const angle = (percent: number) => 2 * Math.PI * (percent / 100) - Math.PI / 2;
                            const x1 = 30 + rOuter * Math.cos(angle(start));
                            const y1 = 30 + rOuter * Math.sin(angle(start));
                            const x2 = 30 + rOuter * Math.cos(angle(end));
                            const y2 = 30 + rOuter * Math.sin(angle(end));
                            const x3 = 30 + rInner * Math.cos(angle(end));
                            const y3 = 30 + rInner * Math.sin(angle(end));
                            const x4 = 30 + rInner * Math.cos(angle(start));
                            const y4 = 30 + rInner * Math.sin(angle(start));
                            const path = [
                              `M${x1},${y1}`,
                              `A${rOuter},${rOuter} 0 ${large} 1 ${x2},${y2}`,
                              `L${x3},${y3}`,
                              `A${rInner},${rInner} 0 ${large} 0 ${x4},${y4}`,
                              'Z',
                            ].join(' ');
                            // For label position: use the middle angle of the segment
                            const midPercent = (start + end) / 2;
                            const midAngle = angle(midPercent);
                            const labelRadius = 32; // outside the donut
                            const labelX = 30 + labelRadius * Math.cos(midAngle);
                            const labelY = 30 + labelRadius * Math.sin(midAngle);
                            return (
                              <g key={d.label}>
                                <path
                                  d={path}
                                  fill={gradients[i]}
                                  style={{
                                    filter: hovered === i ? 'brightness(1.2) drop-shadow(0 0 12px #0003)' : undefined,
                                    transition: 'all 0.25s cubic-bezier(.36,1.56,.64,1)',
                                    cursor: 'pointer',
                                    opacity: hovered === null || hovered === i ? 1 : 0.5,
                                  }}
                                  onMouseEnter={() => {
                                    setHovered(i);
                                    setLabelPos({ x: labelX, y: labelY });
                                  }}
                                  onMouseLeave={() => {
                                    setHovered(null);
                                    setLabelPos(null);
                                  }}
                                />
                                {/* Animated label outside the donut */}
                                {hovered === i && labelPos && (
                                  (() => {
                                    // Move label further out and clamp to SVG bounds
                                    const svgSize = 60;
                                    const margin = 8;
                                    const labelW = 64, labelH = 28;
                                    let x = labelPos.x, y = labelPos.y;
                                    // Move label further out from donut
                                    const dx = x - 30, dy = y - 30;
                                    const dist = Math.sqrt(dx*dx + dy*dy);
                                    const extra = 16;
                                    x = 30 + (dx / (dist || 1)) * (dist + extra);
                                    y = 30 + (dy / (dist || 1)) * (dist + extra);
                                    // Clamp to SVG bounds
                                    x = Math.max(margin + labelW/2, Math.min(svgSize - margin - labelW/2, x));
                                    y = Math.max(margin, Math.min(svgSize - margin - labelH, y));
                                    return (
                                      <foreignObject
                                        x={x - labelW/2}
                                        y={y - labelH/2}
                                        width={labelW}
                                        height={labelH}
                                        style={{ pointerEvents: 'none' }}
                                      >
                                        <div className="fade-in-out rounded-md px-2 py-1 shadow-lg bg-white/95 dark:bg-gray-900/95 border border-blue-200 dark:border-blue-800 text-center" style={{
                                          color: '#0ea5e9',
                                          fontWeight: 600,
                                          fontSize: 10,
                                          textShadow: '0 2px 8px #0001',
                                          transition: 'opacity 0.3s',
                                          minWidth: 0,
                                          minHeight: 0,
                                          boxSizing: 'border-box',
                                        }}>
                                          <div className="text-gray-700 dark:text-gray-200 font-semibold text-[10px] mb-0.5">{d.label}</div>
                                          <div className="text-xs font-bold">{d.value}</div>
                                        </div>
                                      </foreignObject>
                                    );
                                  })()
                                )}
                              </g>
                            );
                          })}
                          {/* White donut center */}
                          <circle cx="30" cy="30" r="13" fill="#fff" />
                          {/* Center label only if not hovering */}
                          {hovered === null && (
                            <>
                              <text x="30" y="25" textAnchor="middle" fontSize="0.58rem" fontWeight="bold" fill="#334155">
                                Total
                              </text>
                              <text x="30" y="30" textAnchor="middle" fontSize="0.74rem" fontWeight="bold" fill="#0ea5e9">
                                {total}
                              </text>
                            </>
                          )}
                        </svg>
                        <style>{`
                          .fade-in-out { opacity: 0; animation: fadeInOutLabel 0.4s forwards; }
                          @keyframes fadeInOutLabel { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: none; } }
                        `}</style>
                      </div>
                    );
                  })()}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((d, i) => {
                      const swatch = [
                        'bg-gradient-to-br from-green-200 to-green-500',
                        'bg-gradient-to-br from-blue-200 to-blue-600',
                        'bg-gradient-to-br from-yellow-100 to-yellow-400',
                        'bg-gradient-to-br from-pink-100 to-pink-500',
                      ];
                      return (
                        <div key={d.label} className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
                          <span className={`inline-block w-4 h-4 rounded-full ${swatch[i]}`}></span>
                          <span className="text-gray-700 dark:text-gray-200 font-bold">{d.label}</span>
                          <span className="text-xs text-gray-500 ml-1 font-normal">({d.value})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Table Analytics */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 animate-fade-in-up delay-300">
              <div className="flex items-center gap-2 mb-4"><ListChecks className="h-5 w-5 text-blue-500 animate-bounce" /><span className="font-semibold text-gray-900 dark:text-white">Recent Projects</span></div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="bg-blue-50 dark:bg-blue-900">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Progress</th>
                      <th className="px-4 py-2">End Date</th>
                      <th className="px-4 py-2">Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map((p, i) => (
                      <tr key={p.id} className={`transition-all duration-300 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900 animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <td className="px-4 py-2 font-medium">{p.name}</td>
                        <td className="px-4 py-2 capitalize">{p.status}</td>
                        <td className="px-4 py-2">{p.progress}%</td>
                        <td className="px-4 py-2">{p.endDate}</td>
                        <td className="px-4 py-2">{p.team.map(u => u.name).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <Button icon={FileDown} variant="primary" onClick={handleExportPDF}>Export as PDF</Button>
            </div>
            <style>{`
              .animate-fade-in-up { animation: fadeInUp 0.7s both; }
              .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
              .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
              .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
              .animate-grow-bar { animation: growBar 1s cubic-bezier(.36,1.56,.64,1) both; }
              @keyframes growBar { from { height: 0; } to { } }
              .animate-grow-pie { animation: growPie 1.2s cubic-bezier(.36,1.56,.64,1) both; }
              @keyframes growPie { from { opacity: 0; } to { opacity: 1; } }
              .animate-spin-slow { animation: spin 8s linear infinite; }
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        );
      case 'settings':
        // Settings state extensions
        const [showChangePassword, setShowChangePassword] = useState(false);
        const [showDeleteAccount, setShowDeleteAccount] = useState(false);
        const themeOptions = [
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ];
        const languageOptions = [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
        ];
        const fontSizeOptions = [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ];
        // Extend settings state if missing keys
        const fullSettings = {
          theme: settings.theme || 'light',
          darkMode: settings.darkMode ?? false,
          notifications: settings.notifications ?? true,
          emailNotifications: settings.emailNotifications ?? false,
          soundNotifications: settings.soundNotifications ?? true,
          dailySummary: settings.dailySummary ?? false,
          language: settings.language || 'en',
          fontSize: settings.fontSize || 'md',
          highContrast: settings.highContrast ?? false,
          twoFactor: settings.twoFactor ?? false,
        };
        // Save settings helper
        const saveSettings = (newSettings: any) => {
          setSettings((s: any) => ({ ...s, ...newSettings }));
          toast.success('Settings saved!');
        };
        return (
          <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 animate-fade-in space-y-10">
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="h-7 w-7 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            {/* Theme & Appearance */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Theme & Appearance</h3>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Theme</span>
                <Select
                  options={themeOptions}
                  value={themeOptions.find(o => o.value === fullSettings.theme)}
                  onChange={opt => { if (opt) saveSettings({ theme: opt.value, darkMode: opt.value === 'dark' }); }}
                  classNamePrefix="react-select"
                  styles={{ container: base => ({ ...base, minWidth: 120 }) }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Font Size</span>
                <Select
                  options={fontSizeOptions}
                  value={fontSizeOptions.find(o => o.value === fullSettings.fontSize)}
                  onChange={opt => { if (opt) saveSettings({ fontSize: opt.value }); }}
                  classNamePrefix="react-select"
                  styles={{ container: base => ({ ...base, minWidth: 120 }) }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">High Contrast</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.highContrast ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ highContrast: !fullSettings.highContrast })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.highContrast ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
            </div>
            {/* Notifications */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Notifications</h3>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Enable Notifications</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.notifications ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ notifications: !fullSettings.notifications })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.notifications ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Email Notifications</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.emailNotifications ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ emailNotifications: !fullSettings.emailNotifications })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.emailNotifications ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Sound Notifications</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.soundNotifications ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ soundNotifications: !fullSettings.soundNotifications })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.soundNotifications ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Daily Summary</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.dailySummary ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ dailySummary: !fullSettings.dailySummary })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.dailySummary ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
            </div>
            {/* Language */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Language</h3>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">App Language</span>
                <Select
                  options={languageOptions}
                  value={languageOptions.find(o => o.value === fullSettings.language)}
                  onChange={opt => { if (opt) saveSettings({ language: opt.value }); }}
                  classNamePrefix="react-select"
                  styles={{ container: base => ({ ...base, minWidth: 120 }) }}
                />
              </div>
            </div>
            {/* Account & Security */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Account & Security</h3>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-200">Two-Factor Authentication</span>
                <button
                  type="button"
                  className={`w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 ${fullSettings.twoFactor ? 'bg-blue-600' : ''}`}
                  onClick={() => saveSettings({ twoFactor: !fullSettings.twoFactor })}
                >
                  <span className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${fullSettings.twoFactor ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setShowChangePassword(true)}>Change Password</Button>
                <Button variant="ghost" onClick={() => toast('Logged out! (mock)')}>Logout</Button>
              </div>
            </div>
            {/* Data & Privacy */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Data & Privacy</h3>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => toast('Download started! (mock)')}>Download My Data</Button>
                <Button variant="danger" onClick={() => setShowDeleteAccount(true)}>Delete My Account</Button>
              </div>
            </div>
            {/* Modals */}
            <Modal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password" size="sm">
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowChangePassword(false); toast.success('Password changed! (mock)'); }}>
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Current Password" required />
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="New Password" required />
                <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Confirm New Password" required />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowChangePassword(false)} type="button">Cancel</Button>
                  <Button type="submit">Change</Button>
                </div>
              </form>
            </Modal>
            <Modal isOpen={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} title="Delete Account" size="sm">
              <div className="space-y-4">
                <p className="text-red-600 font-semibold">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowDeleteAccount(false)} type="button">Cancel</Button>
                  <Button variant="danger" onClick={() => { setShowDeleteAccount(false); toast.success('Account deleted! (mock)'); }}>Delete</Button>
                </div>
              </div>
            </Modal>
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

  useEffect(() => {
    // When filters change, close modals and trigger fade-in (do not reset selected date)
    setCalendarModalOpen(false);
    setCalendarFadeKey(k => k + 1);
  }, [calendarFilter]);

  // Helper: get all deadlines for a date (filtered)
  const getDeadlinesForDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    let filteredTasks = tasks.filter(t => t.dueDate === dateStr);
    let filteredProjects = projects.filter(p => p.endDate === dateStr);
    if (calendarFilter.project.length > 0) {
      filteredTasks = filteredTasks.filter(t => calendarFilter.project.includes(t.projectId));
      filteredProjects = filteredProjects.filter(p => calendarFilter.project.includes(p.id));
    }
    if (calendarFilter.user.length > 0) {
      filteredTasks = filteredTasks.filter(t => calendarFilter.user.includes(t.assignee.id));
      filteredProjects = filteredProjects.filter(p => p.team.some(u => calendarFilter.user.includes(u.id)));
    }
    if (calendarFilter.status.length > 0) {
      filteredTasks = filteredTasks.filter(t => calendarFilter.status.includes(t.status));
      filteredProjects = filteredProjects.filter(p => calendarFilter.status.includes(p.status));
    }
    return { tasks: filteredTasks, projects: filteredProjects };
  };

  // Helper: get all dates with deadlines (filtered)
  const getAllDeadlineDates = () => {
    let allDates = new Set();
    tasks.forEach(t => {
      if (
        (calendarFilter.project.length === 0 || calendarFilter.project.includes(t.projectId)) &&
        (calendarFilter.user.length === 0 || calendarFilter.user.includes(t.assignee.id)) &&
        (calendarFilter.status.length === 0 || calendarFilter.status.includes(t.status))
      ) {
        allDates.add(t.dueDate);
      }
    });
    projects.forEach(p => {
      if (
        (calendarFilter.project.length === 0 || calendarFilter.project.includes(p.id)) &&
        (calendarFilter.user.length === 0 || p.team.some(u => calendarFilter.user.includes(u.id))) &&
        (calendarFilter.status.length === 0 || calendarFilter.status.includes(p.status))
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