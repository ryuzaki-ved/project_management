import React from 'react';
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Clock,
  TrendingUp,
  Calendar
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
              <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
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
                      <span className="font-medium text-gray-900">{project.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 group relative overflow-visible">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out group-hover:scale-y-125 group-hover:shadow-lg"
                      style={{ 
                        width: `${project.progress}%`,
                        background: `linear-gradient(90deg, ${project.progress < 50 ? '#f59e0b' : project.progress < 100 ? '#3b82f6' : '#10b981'}, #a78bfa)`
                      }}
                      title={`Progress: ${project.progress}%`}
                    />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-xs bg-gray-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transition-transform duration-300 group-hover:-translate-y-2">
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
            <h3 className="text-lg font-semibold text-gray-900">Team Activity</h3>
            <Users className="h-5 w-5 text-gray-400" />
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
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.role}</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={onViewAllProjects}>
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
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingTasks.slice(0, 2).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};