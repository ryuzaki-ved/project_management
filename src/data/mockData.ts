import { Project, Task, User, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    role: 'admin',
    status: 'online'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    role: 'manager',
    status: 'online'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    role: 'member',
    status: 'away'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@example.com',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    role: 'member',
    status: 'online'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Redesign',
    description: 'Complete overhaul of the online shopping experience with modern UI/UX',
    status: 'active',
    priority: 'high',
    progress: 75,
    startDate: '2024-01-01',
    endDate: '2024-03-15',
    team: [mockUsers[0], mockUsers[1], mockUsers[2]],
    color: '#3B82F6',
    tasksCount: 24,
    completedTasks: 18
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for iOS and Android',
    status: 'active',
    priority: 'urgent',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-05-30',
    team: [mockUsers[1], mockUsers[3]],
    color: '#8B5CF6',
    tasksCount: 32,
    completedTasks: 14
  },
  {
    id: '3',
    name: 'Brand Identity System',
    description: 'Comprehensive brand guidelines and visual identity package',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-01-15',
    team: [mockUsers[0], mockUsers[2]],
    color: '#10B981',
    tasksCount: 16,
    completedTasks: 16
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    description: 'Real-time data visualization and reporting platform',
    status: 'on-hold',
    priority: 'low',
    progress: 20,
    startDate: '2024-03-01',
    endDate: '2024-06-15',
    team: [mockUsers[3]],
    color: '#F59E0B',
    tasksCount: 28,
    completedTasks: 6
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new checkout flow',
    description: 'Create wireframes and prototypes for the improved checkout process',
    status: 'in-progress',
    priority: 'high',
    assignee: mockUsers[0],
    projectId: '1',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20',
    tags: ['design', 'ux'],
    attachments: [],
    comments: []
  },
  {
    id: '2',
    title: 'Implement payment gateway',
    description: 'Integrate Stripe payment processing with the new checkout system',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[1],
    projectId: '1',
    dueDate: '2024-02-20',
    createdAt: '2024-01-22',
    tags: ['development', 'backend'],
    attachments: [],
    comments: []
  },
  {
    id: '3',
    title: 'User testing sessions',
    description: 'Conduct usability testing with 10 target users',
    status: 'completed',
    priority: 'medium',
    assignee: mockUsers[2],
    projectId: '1',
    dueDate: '2024-02-10',
    createdAt: '2024-01-15',
    tags: ['testing', 'research'],
    attachments: [],
    comments: []
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows',
    status: 'review',
    priority: 'medium',
    assignee: mockUsers[3],
    projectId: '2',
    dueDate: '2024-02-25',
    createdAt: '2024-01-25',
    tags: ['devops', 'automation'],
    attachments: [],
    comments: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Design new checkout flow"',
    timestamp: '2024-01-28T10:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'deadline_approaching',
    title: 'Deadline Approaching',
    message: 'Task "User testing sessions" is due in 2 days',
    timestamp: '2024-01-28T09:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Marcus Johnson completed "Setup development environment"',
    timestamp: '2024-01-27T16:45:00Z',
    read: true
  }
];