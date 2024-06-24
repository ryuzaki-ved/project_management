import React from 'react';
import { Bell, Plus, MessageSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { mockUsers } from '../../data/mockData';

interface HeaderProps {
  onCreateProject: () => void;
  notificationCount: number;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onCreateTask?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCreateProject, 
  notificationCount, 
  onProfileClick,
  onNotificationsClick,
  onCreateTask
}) => {
  const currentUser = mockUsers[0];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good morning, Sarah!</h2>
          <p className="text-gray-600 dark:text-gray-300">Let's make today productive</p>
        </div>

        <div className="flex items-center gap-4">
          {onCreateTask && (
            <Button
              variant="ghost"
              size="sm"
              icon={Plus}
              onClick={onCreateTask}
              className="hidden sm:flex"
            >
              New Task
            </Button>
          )}
          
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateProject}
            className="hidden sm:flex"
          >
            New Project
          </Button>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <button
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all duration-200 focus:outline-none active:scale-95"
              onClick={onNotificationsClick}
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </div>
              )}
            </button>

            <button
              onClick={onProfileClick}
              className="focus:outline-none transition-transform duration-200 hover:scale-110"
              aria-label="Open profile dashboard"
            >
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                size="md"
                status={currentUser.status}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};