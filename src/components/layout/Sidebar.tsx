import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Calendar,
  Settings,
  Bell,
  Search,
  BarChart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  notificationCount: number;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: BarChart },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  notificationCount 
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className={`transition-all duration-300 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-2 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-600 rounded-xl">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">ProjectFlow</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage with ease</p>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        {!collapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ` +
                (isActive 
                  ? 'bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-sm' 
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white')
              }
            >
              <Icon className="h-5 w-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        <button
          onClick={() => onViewChange('notifications')}
          className={
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ` +
            (activeView === 'notifications' 
              ? 'bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-sm' 
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white')
          }
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && !collapsed && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </div>
            )}
          </div>
          {!collapsed && <span className="font-medium">Notifications</span>}
        </button>
        <button
          onClick={() => onViewChange('settings')}
          className={
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ` +
            (activeView === 'settings' 
              ? 'bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-sm' 
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white')
          }
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
};