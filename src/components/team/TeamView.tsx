import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Activity, 
  Star, 
  Phone, 
  Video, 
  Edit, 
  Trash2, 
  UserPlus, 
  Settings, 
  BarChart3, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Building, 
  Briefcase,
  Globe,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Eye,
  Download,
  Upload,
  Share2,
  Bell,
  Heart,
  Coffee,
  Gamepad2,
  Gift,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { mockUsers, mockProjects, mockTasks } from '../../data/mockData';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member' | 'guest';
  status: 'online' | 'offline' | 'away' | 'busy';
  department: string;
  joinDate: string;
  lastActive: string;
  skills: string[];
  projects: number;
  tasksCompleted: number;
  performance: number;
  timezone: string;
  phone?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

const enhancedUsers: TeamMember[] = mockUsers.map((user, index) => ({
  ...user,
  department: ['Engineering', 'Design', 'Marketing', 'Sales'][index % 4],
  joinDate: ['2023-01-15', '2023-03-20', '2023-06-10', '2023-09-05'][index],
  lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  skills: [
    ['React', 'TypeScript', 'Node.js', 'AWS'],
    ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    ['SEO', 'Content Strategy', 'Analytics', 'Social Media'],
    ['CRM', 'Lead Generation', 'Negotiation', 'Presentations']
  ][index % 4],
  projects: Math.floor(Math.random() * 10) + 1,
  tasksCompleted: Math.floor(Math.random() * 50) + 10,
  performance: Math.floor(Math.random() * 30) + 70,
  timezone: ['PST', 'EST', 'GMT', 'CET'][index % 4],
  phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  location: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Berlin, DE'][index % 4],
  bio: [
    'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
    'Creative designer focused on user-centered design and innovative digital experiences.',
    'Strategic marketer with expertise in growth hacking and data-driven campaigns.',
    'Results-driven sales professional with a track record of exceeding targets.'
  ][index % 4],
  socialLinks: {
    linkedin: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '')}`,
    github: index % 2 === 0 ? `https://github.com/${user.name.toLowerCase().replace(' ', '')}` : undefined,
    twitter: index % 3 === 0 ? `https://twitter.com/${user.name.toLowerCase().replace(' ', '')}` : undefined
  }
}));

export const TeamView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'org-chart'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [showTeamAnalytics, setShowTeamAnalytics] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member',
    department: '',
    message: ''
  });

  const departments = ['all', 'Engineering', 'Design', 'Marketing', 'Sales'];
  const statuses = ['all', 'online', 'offline', 'away', 'busy'];

  const filteredMembers = enhancedUsers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'away': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'busy': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'manager': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'member': return <UserCheck className="h-4 w-4 text-green-600" />;
      default: return <UserX className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900';
    if (performance >= 75) return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
    if (performance >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    return 'text-red-600 bg-red-100 dark:bg-red-900';
  };

  const handleInviteMember = () => {
    console.log('Inviting member:', inviteForm);
    setShowInviteModal(false);
    setInviteForm({ email: '', role: 'member', department: '', message: '' });
  };

  const MemberCard = ({ member }: { member: TeamMember }) => (
    <Card hover className="group transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                src={member.avatar}
                alt={member.name}
                size="lg"
                status={member.status}
                className="ring-2 ring-white dark:ring-gray-800 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                {getRoleIcon(member.role)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{member.department}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={member.status === 'online' ? 'success' : 'default'} size="sm">
                  {member.status}
                </Badge>
                <Badge variant="info" size="sm">
                  {member.role}
                </Badge>
              </div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => {
                setSelectedMember(member);
                setShowMemberDetails(true);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Performance</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
              {member.performance}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${member.performance}%`,
                background: member.performance >= 90 ? '#10b981' : 
                           member.performance >= 75 ? '#3b82f6' : 
                           member.performance >= 60 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">{member.projects}</div>
              <div className="text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">{member.tasksCompleted}</div>
              <div className="text-gray-600 dark:text-gray-400">Tasks</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                +{member.skills.length - 3}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" icon={MessageSquare} className="flex-1">
              Chat
            </Button>
            <Button variant="ghost" size="sm" icon={Mail} className="flex-1">
              Email
            </Button>
            <Button variant="ghost" size="sm" icon={Video}>
              <span className="sr-only">Video Call</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const MemberListItem = ({ member }: { member: TeamMember }) => (
    <Card hover className="group">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={member.avatar}
            alt={member.name}
            size="md"
            status={member.status}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
              {getRoleIcon(member.role)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{member.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" size="sm">{member.department}</Badge>
              <Badge variant={member.status === 'online' ? 'success' : 'default'} size="sm">
                {member.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.performance}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.projects}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{member.tasksCompleted}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Tasks</div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" icon={MessageSquare} />
            <Button variant="ghost" size="sm" icon={Mail} />
            <Button variant="ghost" size="sm" icon={Eye} onClick={() => {
              setSelectedMember(member);
              setShowMemberDetails(true);
            }} />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your team members and collaboration</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon={BarChart3} onClick={() => setShowTeamAnalytics(true)}>
            Analytics
          </Button>
          <Button icon={UserPlus} onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Activity className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <div className="p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {enhancedUsers.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Members</div>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
          <div className="p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1 flex items-center justify-center gap-1">
              {enhancedUsers.filter(u => u.status === 'online').length}
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Online Now</div>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
          <div className="p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {Math.round(enhancedUsers.reduce((acc, user) => acc + user.performance, 0) / enhancedUsers.length)}%
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Avg Performance</div>
          </div>
        </Card>

        <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
          <div className="p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-orange-600 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {enhancedUsers.reduce((acc, user) => acc + user.tasksCompleted, 0)}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Tasks Completed</div>
          </div>
        </Card>
      </div>

      {/* Team Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Members ({filteredMembers.length})
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={Download}>
              Export
            </Button>
            <Button variant="ghost" size="sm" icon={Settings}>
              Manage
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <MemberListItem key={member.id} member={member} />
            ))}
          </div>
        )}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button icon={UserPlus} onClick={() => setShowInviteModal(true)}>
              Invite First Member
            </Button>
          </div>
        )}
      </div>

      {/* Department Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Department Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.slice(1).map((dept) => {
            const deptMembers = enhancedUsers.filter(u => u.department === dept);
            const avgPerformance = Math.round(deptMembers.reduce((acc, u) => acc + u.performance, 0) / deptMembers.length);
            
            return (
              <div key={dept} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{dept}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Members:</span>
                    <span className="font-medium">{deptMembers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Performance:</span>
                    <span className="font-medium">{avgPerformance}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Online:</span>
                    <span className="font-medium text-green-600">
                      {deptMembers.filter(u => u.status === 'online').length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="colleague@company.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Department</option>
                {departments.slice(1).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={inviteForm.message}
              onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Welcome to our team! We're excited to have you join us..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember} icon={UserPlus}>
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal
          isOpen={showMemberDetails}
          onClose={() => setShowMemberDetails(false)}
          title="Team Member Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-6">
              <Avatar
                src={selectedMember.avatar}
                alt={selectedMember.name}
                size="xl"
                status={selectedMember.status}
                className="ring-4 ring-white dark:ring-gray-800 shadow-xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMember.name}</h3>
                  {getRoleIcon(selectedMember.role)}
                  <Badge variant={selectedMember.status === 'online' ? 'success' : 'default'}>
                    {selectedMember.status}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{selectedMember.department}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{selectedMember.bio}</p>
                
                <div className="flex gap-3">
                  <Button size="sm" icon={MessageSquare}>Message</Button>
                  <Button size="sm" variant="ghost" icon={Mail}>Email</Button>
                  <Button size="sm" variant="ghost" icon={Video}>Video Call</Button>
                  <Button size="sm" variant="ghost" icon={Phone}>Call</Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedMember.projects}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Active Projects</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedMember.tasksCompleted}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedMember.performance}%</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Performance</div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedMember.email}</span>
                  </div>
                  {selectedMember.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedMember.phone}</span>
                    </div>
                  )}
                  {selectedMember.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedMember.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{selectedMember.timezone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Work Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span>{selectedMember.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span>{selectedMember.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Joined {new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>Last active {new Date(selectedMember.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill) => (
                  <Badge key={skill} variant="info" className="hover:scale-105 transition-transform">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Completed task "Design Review"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Commented on project discussion</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Upload className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Uploaded design assets</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Team Analytics Modal */}
      <Modal
        isOpen={showTeamAnalytics}
        onClose={() => setShowTeamAnalytics(false)}
        title="Team Analytics"
        size="xl"
      >
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="p-4">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
                <div className="text-sm text-green-600">Team Satisfaction</div>
              </div>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="p-4">
                <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
                <div className="text-sm text-blue-600">Productivity Score</div>
              </div>
            </Card>
            
            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="p-4">
                <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
                <div className="text-sm text-purple-600">Retention Rate</div>
              </div>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Performance</h3>
            <div className="space-y-4">
              {departments.slice(1).map((dept) => {
                const deptMembers = enhancedUsers.filter(u => u.department === dept);
                const avgPerformance = Math.round(deptMembers.reduce((acc, u) => acc + u.performance, 0) / deptMembers.length);
                
                return (
                  <div key={dept} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{dept}</span>
                      <span className="text-gray-600 dark:text-gray-300">{avgPerformance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${avgPerformance}%`,
                          background: avgPerformance >= 90 ? '#10b981' : 
                                     avgPerformance >= 75 ? '#3b82f6' : 
                                     avgPerformance >= 60 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Team Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Engagement</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Daily Standups</span>
                  </div>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Team Discussions</span>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Team Activities</span>
                  </div>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Recognition Given</span>
                  </div>
                  <span className="text-sm font-medium">91%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performers</h3>
              <div className="space-y-3">
                {enhancedUsers
                  .sort((a, b) => b.performance - a.performance)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <Avatar src={member.avatar} alt={member.name} size="sm" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{member.department}</div>
                      </div>
                      <div className="text-sm font-bold text-green-600">{member.performance}%</div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </Modal>
    </div>
  );
};