import React, { useState } from 'react';
import { Plus, Filter, Grid, List } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProjectCard } from './ProjectCard';
import { mockProjects } from '../../data/mockData';

interface ProjectsViewProps {
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onProjectClick,
  onCreateProject
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');

  const filteredProjects = mockProjects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your projects and track progress</p>
        </div>
        <Button icon={Plus} onClick={onCreateProject}>
          New Project
        </Button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`
        grid gap-6 transition-all duration-300
        ${viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
        }
      `}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project.id)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "Get started by creating your first project"
              : `No ${filter} projects at the moment`
            }
          </p>
          <Button icon={Plus} onClick={onCreateProject}>
            Create Project
          </Button>
        </div>
      )}
    </div>
  );
};