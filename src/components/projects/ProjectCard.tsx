import React from 'react';
import { Calendar, Users, MoreHorizontal, Target } from 'lucide-react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'on-hold': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card hover className="cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-2xl" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse"
                style={{ backgroundColor: project.color }}
              />
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace('-', ' ')}
              </Badge>
              <Badge variant={getPriorityVariant(project.priority)}>
                {project.priority}
              </Badge>
            </div>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded group-hover:rotate-90 transition-transform duration-300">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden group relative">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out"
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

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{project.completedTasks}/{project.tasksCount} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{project.team.length} members</span>
            </div>
            <div className="flex -space-x-2">
              {project.team.slice(0, 3).map((member, index) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  size="sm"
                  className="ring-2 ring-white transition-transform duration-300 group-hover:scale-110"
                />
              ))}
              {project.team.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600 transition-transform duration-300 group-hover:scale-110">
                  +{project.team.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};