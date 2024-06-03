import React from 'react';
import { Calendar, MessageSquare, Paperclip, Flag } from 'lucide-react';
import { Task } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'review': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card 
      hover 
      className={`cursor-pointer group ${isOverdue ? 'ring-2 ring-red-200' : ''}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
              {task.description}
            </p>
            <Badge variant={getStatusVariant(task.status)}>
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            {task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                <span>{task.attachments.length}</span>
              </div>
            )}
            {task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{task.comments.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <Avatar
              src={task.assignee.avatar}
              alt={task.assignee.name}
              size="sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};