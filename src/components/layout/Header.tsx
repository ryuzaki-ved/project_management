import React from 'react';
import { Bell, Plus, MessageSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { mockUsers } from '../../data/mockData';

interface HeaderProps {
  onCreateTask: () => void;
  onCreateProject: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCreateTask, 
  onCreateProject, 
  notificationCount 
}) => {
  const currentUser = mockUsers[0];

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Good morning, Sarah!</h2>
          <p className="text-gray-600">Let's make today productive</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={onCreateTask}
            className="hidden sm:flex"
          >
            New Task
          </Button>
          
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
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </div>
              )}
            </button>

            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              size="md"
              status={currentUser.status}
            />
          </div>
        </div>
      </div>
    </header>
  );
};