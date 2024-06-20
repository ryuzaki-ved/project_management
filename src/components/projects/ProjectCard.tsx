import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MoreHorizontal, 
  Target, 
  Star, 
  Eye, 
  Edit, 
  Share2, 
  Bookmark, 
  Clock, 
  TrendingUp, 
  Award, 
  Zap, 
  Heart, 
  MessageSquare, 
  Bell, 
  Flag,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Sparkles
} from 'lucide-react';
import { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement view project functionality
  };

  const handleEditProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement edit project functionality
  };

  const handleShareProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share project functionality
  };

  const handleMoreActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement more actions functionality
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      case 'active': return <Play className="h-4 w-4" />;
      case 'on-hold': return <Pause className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Flag className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = new Date(project.endDate) < new Date() && project.status !== 'completed';
  const daysUntilDue = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card 
      hover 
      className={`cursor-pointer group transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden ${
        isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
      }`}
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
        style={{ 
          background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)` 
        }}
      />
      
      {/* Floating action buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button
          onClick={(e) => {
            handleBookmarkToggle(e);
          }}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isBookmarked 
              ? 'bg-yellow-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
          }`}
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            handleLikeToggle(e);
          }}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30'
          }`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Priority indicator */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
           style={{ color: project.color }} />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-4 h-4 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg relative"
                  style={{ backgroundColor: project.color }}
                >
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg leading-tight">
                  {project.name}
                </h3>
                {project.progress === 100 && (
                  <div className="flex items-center gap-1 text-green-600 animate-bounce">
                    <Award className="h-4 w-4" />
                    <Sparkles className="h-3 w-3" />
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(project.status)} className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {project.status.replace('-', ' ')}
                </Badge>
                <Badge variant={getPriorityVariant(project.priority)} className="flex items-center gap-1">
                  {getPriorityIcon(project.priority)}
                  {project.priority}
                </Badge>
                {isOverdue && (
                  <Badge variant="danger" className="animate-pulse">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-gray-900 dark:text-white">{project.progress}%</span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden group/progress">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ 
                  width: `${project.progress}%`,
                  background: `linear-gradient(90deg, ${
                    project.progress < 30 ? '#ef4444' : 
                    project.progress < 70 ? '#f59e0b' : 
                    project.progress < 100 ? '#3b82f6' : '#10b981'
                  }, ${project.color})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover/progress:opacity-100 transition-opacity bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-sm">
                  {project.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Target className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {project.completedTasks}/{project.tasksCount}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <div className={`text-sm font-bold ${
                  isOverdue ? 'text-red-600 dark:text-red-400' : 
                  daysUntilDue <= 7 ? 'text-orange-600 dark:text-orange-400' : 
                  'text-gray-900 dark:text-white'
                }`}>
                  {isOverdue ? 'Overdue' : daysUntilDue <= 0 ? 'Today' : `${daysUntilDue}d`}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {isOverdue ? 'Past due' : 'Remaining'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Team ({project.team.length})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">12</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.team.slice(0, 4).map((member, index) => (
                <div key={member.id} className="relative group/avatar">
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    size="sm"
                    className="ring-2 ring-white dark:ring-gray-800 transition-all duration-300 group-hover:scale-110 hover:z-10 shadow-lg"
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    {member.name}
                  </div>
                </div>
              ))}
              {project.team.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white shadow-lg hover:scale-110 transition-transform duration-300">
                  +{project.team.length - 4}
                </div>
              )}
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <Button variant="ghost" size="sm" className="p-1.5 h-auto" onClick={handleViewProject}>
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 h-auto" onClick={handleEditProject}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1.5 h-auto" onClick={handleShareProject}>
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated 2h ago</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {project.progress >= 90 && (
              <div className="flex items-center gap-1 text-green-600 animate-pulse">
                <Zap className="h-3 w-3" />
                <span className="text-xs font-medium">Almost done!</span>
              </div>
            )}
            <button onClick={handleMoreActions} className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transform rotate-0 hover:rotate-90">
              <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};