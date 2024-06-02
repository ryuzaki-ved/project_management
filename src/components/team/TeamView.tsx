import React from 'react';
import { Mail, MessageSquare, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { mockUsers } from '../../data/mockData';

export const TeamView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team</h2>
          <p className="text-gray-600">Manage your team members and collaboration</p>
        </div>
        <Button>
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => (
          <Card key={user.id} hover>
            <div className="text-center space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="xl"
                    status={user.status}
                    className="mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                <Badge 
                  variant={user.role === 'admin' ? 'info' : user.role === 'manager' ? 'warning' : 'default'}
                >
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'online' ? 'success' : 'default'}>
                  {user.status}
                </Badge>
              </div>

              <div className="flex gap-2 justify-center">
                <Button variant="ghost" size="sm" icon={Mail}>
                  Email
                </Button>
                <Button variant="ghost" size="sm" icon={MessageSquare}>
                  Message
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Team Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockUsers.filter(u => u.status === 'online').length}
            </div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockUsers.filter(u => u.role === 'admin' || u.role === 'manager').length}
            </div>
            <div className="text-sm text-gray-600">Managers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockUsers.length}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
        </div>
      </Card>
    </div>
  );
};