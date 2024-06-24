import React, { useState } from 'react';
import { Plus, Filter, Grid, List, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { TaskCard } from './TaskCard';
import { CreateTaskForm } from './CreateTaskForm';
import { Badge } from '../ui/Badge';
import { Task } from '../../types';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface TasksViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  onTaskClick: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  setTasks,
  onTaskClick,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [filter, setFilter] = useState<'all' | 'my-tasks' | 'today' | 'overdue'>('all');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4()
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setShowCreateTaskModal(false);
    toast.success('Task created successfully!');
  };

  const getFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'my-tasks':
        return tasks.filter(task => task.assignee.id === '1'); // Current user
      case 'today':
        return tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case 'overdue':
        return tasks.filter(task => 
          new Date(task.dueDate) < today && task.status !== 'completed'
        );
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    completed: filteredTasks.filter(t => t.status === 'completed')
  };

  const KanbanColumn = ({ status, tasks, title }: { status: string; tasks: any[]; title: string }) => (
    <div className="bg-gray-50 rounded-xl p-4 min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <Badge variant="default">{tasks.length}</Badge>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and track your tasks</p>
        </div>
        <Button icon={Plus} onClick={handleCreateTask}>
          New Task
        </Button>
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Tasks</option>
              <option value="my-tasks">My Tasks</option>
              <option value="today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
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
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KanbanColumn status="todo" tasks={tasksByStatus.todo} title="To Do" />
          <KanbanColumn status="in-progress" tasks={tasksByStatus['in-progress']} title="In Progress" />
          <KanbanColumn status="review" tasks={tasksByStatus.review} title="Review" />
          <KanbanColumn status="completed" tasks={tasksByStatus.completed} title="Completed" />
        </div>
      ) : (
        <div className={`
          grid gap-6 transition-all duration-300
          ${viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
          }
        `}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {filter === 'all' 
              ? "Get started by creating your first task"
              : `No ${filter.replace('-', ' ')} tasks at the moment`
            }
          </p>
          <Button icon={Plus} onClick={handleCreateTask}>
            Create Task
          </Button>
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
        size="lg"
      >
        <CreateTaskForm
          onSubmit={handleTaskSubmit}
          onClose={() => setShowCreateTaskModal(false)}
        />
      </Modal>
    </div>
  );
};