export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member';
  status: 'online' | 'offline' | 'away';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  startDate: string;
  endDate: string;
  team: User[];
  color: string;
  tasksCount: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: User;
  projectId: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'project_updated' | 'deadline_approaching';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}