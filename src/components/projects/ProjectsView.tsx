import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Grid, 
  List, 
  Search, 
  Calendar, 
  Users, 
  Target, 
  Clock, 
  TrendingUp, 
  Star, 
  Eye, 
  Edit, 
  Archive, 
  MoreHorizontal,
  Zap,
  Award,
  Activity,
  Bookmark,
  Share2,
  Download,
  Upload,
  Settings,
  ChevronDown,
  SortAsc,
  SortDesc,
  Layers,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Pause,
  Play,
  BarChart3,
  PieChart,
  Sparkles,
  Heart,
  MessageSquare,
  Bell,
  Flag
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ProjectCard } from './ProjectCard';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { mockProjects, mockTasks, mockUsers } from '../../data/mockData';

interface ProjectsViewProps {
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
}

// Enhanced project stats component
const ProjectStats = () => {
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const onHoldProjects = mockProjects.filter(p => p.status === 'on-hold').length;
  const avgProgress = Math.round(mockProjects.reduce((acc, p) => acc + p.progress, 0) / totalProjects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1 animate-counter">
            {totalProjects}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Projects</div>
        </div>
      </Card>

      <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1 flex items-center justify-center gap-1">
            {activeProjects}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">Active</div>
        </div>
      </Card>

      <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {completedProjects}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Completed</div>
        </div>
      </Card>

      <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Pause className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {onHoldProjects}
          </div>
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">On Hold</div>
        </div>
      </Card>

      <Card className="text-center bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        <div className="p-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-indigo-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {avgProgress}%
          </div>
          <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Avg Progress</div>
        </div>
      </Card>
    </div>
  );
};

// Quick actions component
const QuickActions = ({ onCreateProject }: { onCreateProject: () => void }) => (
  <Card className="mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-blue-200 dark:border-blue-800">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Manage your projects efficiently</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={Upload} className="hover:bg-blue-50 dark:hover:bg-blue-900/30">
          Import
        </Button>
        <Button variant="ghost" size="sm" icon={Download} className="hover:bg-green-50 dark:hover:bg-green-900/30">
          Export
        </Button>
        <Button variant="ghost" size="sm" icon={BarChart3} className="hover:bg-purple-50 dark:hover:bg-purple-900/30">
          Analytics
        </Button>
        <Button icon={Plus} onClick={onCreateProject} className="shadow-lg hover:shadow-xl">
          New Project
        </Button>
      </div>
    </div>
  </Card>
);

// Enhanced filter component
const ProjectFilters = ({ 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder, 
  searchTerm, 
  setSearchTerm,
  filteredProjects 
}: any) => (
  <Card className="mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200"
            >
              <option value="name">Name</option>
              <option value="progress">Progress</option>
              <option value="priority">Priority</option>
              <option value="endDate">Due Date</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-600"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  </Card>
);

// View mode selector
const ViewModeSelector = ({ viewMode, setViewMode }: any) => (
  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
    <button
      onClick={() => setViewMode('grid')}
      className={`p-3 rounded-lg transition-all duration-200 ${
        viewMode === 'grid'
          ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-md transform scale-105'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Grid className="h-4 w-4" />
    </button>
    <button
      onClick={() => setViewMode('list')}
      className={`p-3 rounded-lg transition-all duration-200 ${
        viewMode === 'list'
          ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-md transform scale-105'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <List className="h-4 w-4" />
    </button>
    <button
      onClick={() => setViewMode('kanban')}
      className={`p-3 rounded-lg transition-all duration-200 ${
        viewMode === 'kanban'
          ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-md transform scale-105'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Layers className="h-4 w-4" />
    </button>
  </div>
);

// Enhanced project list item for list view
const ProjectListItem = ({ project, onClick }: any) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'on-hold': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <Card hover className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" onClick={onClick}>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-4">
            <div 
              className="w-4 h-4 rounded-full shadow-lg group-hover:scale-125 transition-transform duration-300"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                {project.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-1">
                {project.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</div>
            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${project.progress}%`,
                  background: `linear-gradient(90deg, ${project.progress < 50 ? '#f59e0b' : project.progress < 100 ? '#3b82f6' : '#10b981'}, #a78bfa)`
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(project.priority)} size="sm">
              {project.priority}
            </Badge>
            <Badge className={getStatusColor(project.status)} size="sm">
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{project.team.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Members</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(project.endDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Due Date</div>
          </div>
          
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member: any) => (
              <Avatar
                key={member.id}
                src={member.avatar}
                alt={member.name}
                size="sm"
                className="ring-2 ring-white dark:ring-gray-800 transition-transform duration-300 group-hover:scale-110"
              />
            ))}
            {project.team.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                +{project.team.length - 3}
              </div>
            )}
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button variant="ghost" size="sm" icon={Eye} />
            <Button variant="ghost" size="sm" icon={Edit} />
            <Button variant="ghost" size="sm" icon={MoreHorizontal} />
          </div>
        </div>
      </div>
    </Card>
  );
};

// Kanban column component
const KanbanColumn = ({ status, projects, title, color }: any) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 min-h-[600px] backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full shadow-lg"
          style={{ backgroundColor: color }}
        />
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{title}</h3>
        <Badge variant="default" className="bg-white dark:bg-gray-700 shadow-sm">
          {projects.length}
        </Badge>
      </div>
    </div>
    <div className="space-y-4">
      {projects.map((project: any) => (
        <div key={project.id} className="transform transition-all duration-300 hover:scale-105">
          <ProjectCard project={project} onClick={() => {}} />
        </div>
      ))}
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ filter, onCreateProject }: any) => (
  <div className="text-center py-16">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto shadow-xl">
        <Briefcase className="h-16 w-16 text-blue-500 dark:text-blue-400" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      {filter === 'all' ? 'No projects yet' : `No ${filter} projects`}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
      {filter === 'all' 
        ? "Start your journey by creating your first project and bring your ideas to life"
        : `No ${filter} projects at the moment. Try adjusting your filters or create a new project.`
      }
    </p>
    <div className="flex items-center justify-center gap-4">
      <Button icon={Plus} onClick={onCreateProject} className="shadow-lg hover:shadow-xl">
        Create Your First Project
      </Button>
      <Button variant="ghost" icon={Upload}>
        Import Projects
      </Button>
    </div>
  </div>
);

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onProjectClick,
  onCreateProject
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort projects
  const filteredProjects = mockProjects
    .filter(project => {
      const matchesFilter = filter === 'all' || project.status === filter;
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Group projects by status for kanban view
  const projectsByStatus = {
    active: filteredProjects.filter(p => p.status === 'active'),
    'on-hold': filteredProjects.filter(p => p.status === 'on-hold'),
    completed: filteredProjects.filter(p => p.status === 'completed')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and track your project portfolio</p>
        </div>
        <ViewModeSelector viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Project Stats */}
      <ProjectStats />

      {/* Quick Actions */}
      <QuickActions onCreateProject={onCreateProject} />

      {/* Filters */}
      <ProjectFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredProjects={filteredProjects}
      />

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState filter={filter} onCreateProject={onCreateProject} />
      ) : (
        <>
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KanbanColumn 
                status="active" 
                projects={projectsByStatus.active} 
                title="Active Projects" 
                color="#3B82F6"
              />
              <KanbanColumn 
                status="on-hold" 
                projects={projectsByStatus['on-hold']} 
                title="On Hold" 
                color="#F59E0B"
              />
              <KanbanColumn 
                status="completed" 
                projects={projectsByStatus.completed} 
                title="Completed" 
                color="#10B981"
              />
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => onProjectClick(project.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Project Insights */}
      {filteredProjects.length > 0 && (
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(filteredProjects.reduce((acc, p) => acc + p.progress, 0) / filteredProjects.length)}% average completion • 
                  {filteredProjects.filter(p => p.priority === 'urgent' || p.priority === 'high').length} high priority projects
                </p>
              </div>
            </div>
            <Button variant="ghost" icon={Eye} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
            <Button variant="ghost" icon={Eye} onClick={handleViewProjectDetails} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
              View Details
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};