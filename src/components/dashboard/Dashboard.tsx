import React from 'react';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ProjectCard } from '../projects/ProjectCard';
import { TaskCard } from '../tasks/TaskCard';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { mockProjects, mockTasks, mockUsers } from '../../data/mockData';

interface DashboardProps {
  onProjectClick: (projectId: string) => void;
  onTaskClick: (taskId: string) => void;
  onViewAllProjects: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onProjectClick,
  onTaskClick,
  onViewAllProjects
}) => {
  const activeProjects = mockProjects.filter(p => p.status === 'active');
  const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress').length;
  const upcomingTasks = mockTasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= threeDaysFromNow && t.status !== 'completed';
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={activeProjects.length}
          change="+2 this month"
          changeType="increase"
          icon={FolderKanban}
          color="#3B82F6"
        />
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          change="+12 this week"
          changeType="increase"
          icon={CheckSquare}
          color="#10B981"
        />
        <StatsCard
          title="Team Members"
          value={mockUsers.length}
          change="All active"
          changeType="neutral"
          icon={Users}
          color="#8B5CF6"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          change="3 due today"
          changeType="neutral"
          icon={Clock}
          color="#F59E0B"
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Progress</h3>
              <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-4">
              {activeProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 group relative overflow-visible">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out group-hover:scale-y-125 group-hover:shadow-lg"
                      style={{ 
                        width: `${project.progress}%`,
                        background: `linear-gradient(90deg, ${project.progress < 50 ? '#f59e0b' : project.progress < 100 ? '#3b82f6' : '#10b981'}, #a78bfa)`
                      }}
                      title={`Progress: ${project.progress}%`}
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-xs bg-gray-900 dark:bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transition-transform duration-300 group-hover:-translate-y-2">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Activity</h3>
            <Users className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {mockUsers.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="sm"
                    status={user.status}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.role}</p>
                  </div>
                </div>
                <Badge variant={user.status === 'online' ? 'success' : 'default'}>
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Projects & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h3>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium" onClick={onViewAllProjects}>
              View all
            </button>
          </div>
          <div className="space-y-4">
            {activeProjects.slice(0, 2).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick(project.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h3>
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.slice(0, 4).map((task) => {
              const due = new Date(task.dueDate);
              const today = new Date();
              const isOverdue = due < today && task.status !== 'completed';
              const isSoon = due >= today && due <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
              return (
                <div key={task.id} className="relative group transition-transform duration-200 hover:scale-105">
                  <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
                  {isOverdue && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse z-10">Overdue</span>
                  )}
                  {isSoon && !isOverdue && (
                    <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce z-10">
                      <Bell className="h-3 w-3 animate-ring" /> Soon
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

<style>{`
@keyframes ring {
  0% { transform: rotate(0); }
  10% { transform: rotate(-15deg); }
  20% { transform: rotate(10deg); }
  30% { transform: rotate(-10deg); }
  40% { transform: rotate(6deg); }
  50% { transform: rotate(-4deg); }
  60% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
.animate-ring { animation: ring 1s infinite; }
`}</style>