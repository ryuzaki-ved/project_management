import React, { useState } from 'react';
import { Calendar, User, Flag, Tag, FileText, AlertCircle } from 'lucide-react';
import Select from 'react-select';
import { Button } from '../ui/Button';
import { mockUsers } from '../../data/mockData';
import { Task, User as UserType } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface CreateTaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
  projectId?: string;
}

const priorityOptions = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent', color: '#DC2626' }
];

const statusOptions = [
  { value: 'todo', label: 'To Do', color: '#6B7280' },
  { value: 'in-progress', label: 'In Progress', color: '#3B82F6' },
  { value: 'review', label: 'Review', color: '#F59E0B' },
  { value: 'completed', label: 'Completed', color: '#10B981' }
];

const tagOptions = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'research', label: 'Research' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'ui', label: 'UI' },
  { value: 'ux', label: 'UX' }
];

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onSubmit,
  onClose,
  projectId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    tags: [] as string[],
    projectId: projectId || '1'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userOptions = mockUsers.map(user => ({
    value: user.id,
    label: user.name,
    avatar: user.avatar,
    role: user.role
  }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Task description must be at least 10 characters';
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Please assign the task to a team member';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const assignee = mockUsers.find(user => user.id === formData.assigneeId);
      if (!assignee) {
        throw new Error('Selected assignee not found');
      }

      const newTask: Omit<Task, 'id'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignee,
        projectId: formData.projectId,
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString(),
        tags: formData.tags,
        attachments: [],
        comments: []
      };

      await onSubmit(newTask);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: errors.assigneeId ? '#EF4444' : state.isFocused ? '#3B82F6' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      '&:hover': {
        borderColor: errors.assigneeId ? '#EF4444' : '#9CA3AF'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px'
    })
  };

  const UserOption = ({ data, ...props }: any) => (
    <div {...props} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
      <img
        src={data.avatar}
        alt={data.label}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{data.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{data.role}</div>
      </div>
    </div>
  );

  const UserSingleValue = ({ data }: any) => (
    <div className="flex items-center gap-2">
      <img
        src={data.avatar}
        alt={data.label}
        className="w-5 h-5 rounded-full object-cover"
      />
      <span>{data.label}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Task Title */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="h-4 w-4" />
          Task Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
            errors.title 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
          placeholder="Enter a clear, descriptive task title..."
          maxLength={100}
        />
        {errors.title && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.title}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Task Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="h-4 w-4" />
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none ${
            errors.description 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
          placeholder="Provide detailed information about what needs to be done..."
          maxLength={500}
        />
        {errors.description && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.description}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignee */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <User className="h-4 w-4" />
            Assign To *
          </label>
          <div className="react-select-container">
            <Select
              options={userOptions}
              value={userOptions.find(option => option.value === formData.assigneeId) || null}
              onChange={(option) => handleInputChange('assigneeId', option?.value || '')}
              placeholder="Select team member..."
              isClearable
              isSearchable
              styles={customSelectStyles}
              components={{
                Option: UserOption,
                SingleValue: UserSingleValue
              }}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          {errors.assigneeId && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.assigneeId}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="h-4 w-4" />
            Due Date *
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${
              errors.dueDate 
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
          />
          {errors.dueDate && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* Priority and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Flag className="h-4 w-4" />
            Priority
          </label>
          <div className="react-select-container">
            <Select
              options={priorityOptions}
              value={priorityOptions.find(option => option.value === formData.priority)}
              onChange={(option) => handleInputChange('priority', option?.value || 'medium')}
              placeholder="Select priority..."
              isSearchable={false}
              formatOptionLabel={(option: any) => (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                </div>
              )}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Flag className="h-4 w-4" />
            Status
          </label>
          <div className="react-select-container">
            <Select
              options={statusOptions}
              value={statusOptions.find(option => option.value === formData.status)}
              onChange={(option) => handleInputChange('status', option?.value || 'todo')}
              placeholder="Select status..."
              isSearchable={false}
              formatOptionLabel={(option: any) => (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                </div>
              )}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Tag className="h-4 w-4" />
          Tags
        </label>
        <div className="react-select-container">
          <Select
            options={tagOptions}
            value={tagOptions.filter(option => formData.tags.includes(option.value))}
            onChange={(options) => handleInputChange('tags', options ? options.map((opt: any) => opt.value) : [])}
            placeholder="Add tags to categorize this task..."
            isMulti
            isClearable
            isSearchable
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
          Tags help organize and filter tasks
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};