import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  Target, 
  Award, 
  Zap,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockUsers } from '../../data/mockData';
import { Project, Task } from '../../types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string }> = ({ 
  value, 
  duration = 1000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
};

// Animated Progress Bar
const AnimatedProgressBar: React.FC<{ 
  percentage: number; 
  color: string; 
  label: string;
  value: number;
  total: number;
}> = ({ percentage, color, label, value, total }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="group">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{value}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ 
            width: `${width}%`,
            backgroundColor: color
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Interactive Pie Chart
const InteractivePieChart: React.FC<{
  data: Array<{ name: string; value: number; color: string }>;
  size?: number;
}> = ({ data, size = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;

  let cumulativeAngle = 0;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360 * animationProgress;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          
          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;
          
          const x1 = centerX + radius * Math.cos(startAngleRad);
          const y1 = centerY + radius * Math.sin(startAngleRad);
          const x2 = centerX + radius * Math.cos(endAngleRad);
          const y2 = centerY + radius * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          cumulativeAngle += angle;

          const isHovered = hoveredIndex === index;
          const hoverRadius = isHovered ? radius + 5 : radius;

          return (
            <path
              key={item.name}
              d={pathData}
              fill={item.color}
              className={`transition-all duration-300 cursor-pointer ${
                isHovered ? 'opacity-90 drop-shadow-lg' : 'opacity-80'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                filter: isHovered ? 'brightness(1.1)' : 'none',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: `${centerX}px ${centerY}px`
              }}
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            <AnimatedCounter value={total} />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredIndex !== null && (
        <div className="absolute top-2 left-2 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg z-10 animate-fade-in">
          <div className="font-medium">{data[hoveredIndex].name}</div>
          <div className="text-sm opacity-90">
            {data[hoveredIndex].value} ({((data[hoveredIndex].value / total) * 100).toFixed(1)}%)
          </div>
        </div>
      )}
    </div>
  );
};

// Animated Bar Chart
const AnimatedBarChart: React.FC<{
  data: Array<{ name: string; value: number; color: string }>;
  maxValue?: number;
}> = ({ data, maxValue }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 200);
    return () => clearTimeout(timer);
  }, []);

  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        const animatedWidth = percentage * animationProgress;
        const isHovered = hoveredIndex === index;

        return (
          <div 
            key={item.name}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                <AnimatedCounter value={item.value} />
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${
                  isHovered ? 'shadow-lg' : ''
                }`}
                style={{
                  width: `${animatedWidth}%`,
                  backgroundColor: item.color,
                  transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
              </div>
              {isHovered && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg">
                  {percentage.toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Metric Card with Animation
const MetricCard: React.FC<{
  title: string;
  value: number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  suffix?: string;
}> = ({ title, value, change, changeType = 'neutral', icon: Icon, color, suffix = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600 dark:text-green-400';
      case 'decrease': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="h-3 w-3" />;
      case 'decrease': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card 
      hover 
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          {change && (
            <div className={`flex items-center gap-1 text-sm mt-1 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div 
          className={`p-3 rounded-xl transition-all duration-300 ${
            isHovered ? 'scale-110 shadow-lg' : ''
          }`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className={`h-6 w-6 transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{ color }}
          />
        </div>
      </div>
    </Card>
  );
};

interface ReportsViewProps {
  projects: Project[];
  tasks: Task[];
  onExportPDF: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ projects, tasks, onExportPDF }) => {
  // Generate PDF Report Function
  const generatePdfReport = () => {
    try {
      // Initialize PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Add header with logo area and title
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('ProjectFlow - Analytics Report', 20, 25);
      
      // Add generation date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generated on: ${currentDate}`, pageWidth - 20, 25, { align: 'right' });
      
      let yPosition = 60;
      
      // Executive Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 15;
      
      // Calculate key metrics
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const avgProgress = totalProjects > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) : 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Summary metrics
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const summaryText = [
        `• Total Projects: ${totalProjects} (${activeProjects} active, ${completedProjects} completed)`,
        `• Total Tasks: ${totalTasks} (${completedTasks} completed)`,
        `• Average Project Progress: ${avgProgress}%`,
        `• Overall Task Completion Rate: ${completionRate}%`,
        `• Active Team Members: ${mockUsers.filter(u => u.status === 'online').length}/${mockUsers.length}`
      ];
      
      summaryText.forEach((text, index) => {
        doc.text(text, 25, yPosition + (index * 8));
      });
      yPosition += summaryText.length * 8 + 20;
      
      // Projects Overview Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Projects Overview', 20, yPosition);
      yPosition += 10;
      
      // Prepare project data for table
      const projectTableData = projects.map(project => [
        project.name,
        project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' '),
        project.priority.charAt(0).toUpperCase() + project.priority.slice(1),
        `${project.progress}%`,
        `${project.completedTasks}/${project.tasksCount}`,
        project.team.length.toString(),
        new Date(project.endDate).toLocaleDateString()
      ]);
      
      // Add projects table
      doc.autoTable({
        startY: yPosition,
        head: [['Project Name', 'Status', 'Priority', 'Progress', 'Tasks', 'Team Size', 'Due Date']],
        body: projectTableData,
        theme: 'striped',
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 35 }, // Project Name
          1: { cellWidth: 20 }, // Status
          2: { cellWidth: 20 }, // Priority
          3: { cellWidth: 18 }, // Progress
          4: { cellWidth: 18 }, // Tasks
          5: { cellWidth: 18 }, // Team Size
          6: { cellWidth: 25 }  // Due Date
        },
        margin: { left: 20, right: 20 },
        didDrawPage: (data) => {
          // Add page numbers
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Page ${data.pageNumber}`,
            pageWidth - 30,
            pageHeight - 10
          );
        }
      });
      
      // Get the final Y position after the projects table
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Check if we need a new page for tasks section
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Tasks Overview Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Tasks Overview', 20, yPosition);
      yPosition += 10;
      
      // Prepare task data for table
      const taskTableData = tasks.slice(0, 20).map(task => [ // Limit to first 20 tasks to avoid overly long reports
        task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title,
        task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' '),
        task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
        task.assignee.name,
        new Date(task.dueDate).toLocaleDateString(),
        task.tags.slice(0, 2).join(', ') + (task.tags.length > 2 ? '...' : '')
      ]);
      
      // Add tasks table
      doc.autoTable({
        startY: yPosition,
        head: [['Task Title', 'Status', 'Priority', 'Assignee', 'Due Date', 'Tags']],
        body: taskTableData,
        theme: 'striped',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 45 }, // Task Title
          1: { cellWidth: 25 }, // Status
          2: { cellWidth: 20 }, // Priority
          3: { cellWidth: 30 }, // Assignee
          4: { cellWidth: 25 }, // Due Date
          5: { cellWidth: 35 }  // Tags
        },
        margin: { left: 20, right: 20 },
        didDrawPage: (data) => {
          // Add page numbers
          doc.setFontSize(10);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Page ${data.pageNumber}`,
            pageWidth - 30,
            pageHeight - 10
          );
        }
      });
      
      // Add footer with additional info
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      if (finalY < pageHeight - 50) {
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('This report was generated by ProjectFlow - Project Management Platform', 20, finalY + 10);
        doc.text(`Total items: ${projects.length} projects, ${tasks.length} tasks`, 20, finalY + 20);
        if (tasks.length > 20) {
          doc.text(`Note: Only the first 20 tasks are shown in this report.`, 20, finalY + 30);
        }
      }
      
      // Generate filename with current date
      const filename = `ProjectFlow_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      doc.save(filename);
      
      // Show success message (you might want to use a toast notification here)
      console.log('PDF report generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      // You might want to show an error toast here
      alert('Error generating PDF report. Please try again.');
    }
  };

  // Calculate metrics
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;

  // Project status data for pie chart
  const projectStatusData = [
    { name: 'Active', value: activeProjects, color: '#3B82F6' },
    { name: 'Completed', value: completedProjects, color: '#10B981' },
    { name: 'On Hold', value: onHoldProjects, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  // Task status data for bar chart
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'In Progress', value: inProgressTasks, color: '#3B82F6' },
    { name: 'Review', value: reviewTasks, color: '#F59E0B' },
    { name: 'To Do', value: todoTasks, color: '#6B7280' }
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#EF4444' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F97316' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#EAB308' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#22C55E' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
          <p className="text-gray-600 dark:text-gray-300">Comprehensive insights into your project performance</p>
        </div>
        <Button icon={Download} onClick={generatePdfReport} className="shadow-lg">
          Export PDF
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Projects"
          value={projects.length}
          change="+2 this month"
          changeType="increase"
          icon={FolderKanban}
          color="#3B82F6"
        />
        <MetricCard
          title="Completed Tasks"
          value={completedTasks}
          change="+12 this week"
          changeType="increase"
          icon={CheckSquare}
          color="#10B981"
        />
        <MetricCard
          title="Team Members"
          value={mockUsers.length}
          change="All active"
          changeType="neutral"
          icon={Users}
          color="#8B5CF6"
        />
        <MetricCard
          title="Completion Rate"
          value={Math.round((completedTasks / totalTasks) * 100)}
          change="+5% this month"
          changeType="increase"
          icon={Target}
          color="#F59E0B"
          suffix="%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Breakdown */}
        <Card className="overflow-hidden">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Project Status Breakdown
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Distribution of projects by current status</p>
            </div>
            
            <div className="flex items-center justify-center">
              <InteractivePieChart data={projectStatusData} size={220} />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 gap-3">
              {projectStatusData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">{item.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {((item.value / projects.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Task Status Distribution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current status of all tasks</p>
            </div>
            <AnimatedBarChart data={taskStatusData} />
          </div>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Task Priority Distribution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks categorized by priority level</p>
            </div>
            <div className="flex items-center justify-center">
              <InteractivePieChart data={priorityData} size={200} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                  <Badge variant="default" size="sm">{item.value}</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Progress Overview
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Detailed progress tracking</p>
            </div>
            <div className="space-y-4">
              <AnimatedProgressBar
                percentage={(completedTasks / totalTasks) * 100}
                color="#10B981"
                label="Overall Completion"
                value={completedTasks}
                total={totalTasks}
              />
              <AnimatedProgressBar
                percentage={(completedProjects / projects.length) * 100}
                color="#3B82F6"
                label="Projects Completed"
                value={completedProjects}
                total={projects.length}
              />
              <AnimatedProgressBar
                percentage={(mockUsers.filter(u => u.status === 'online').length / mockUsers.length) * 100}
                color="#8B5CF6"
                label="Team Online"
                value={mockUsers.filter(u => u.status === 'online').length}
                total={mockUsers.length}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center group hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Productivity</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              +<AnimatedCounter value={23} />%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">vs last month</p>
          </div>
        </Card>

        <Card className="text-center group hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Score</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              <AnimatedCounter value={94} />%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average rating</p>
          </div>
        </Card>

        <Card className="text-center group hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Efficiency</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              <AnimatedCounter value={87} />%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">On-time delivery</p>
          </div>
        </Card>
      </div>

      {/* Timeline Overview */}
      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Project Timeline Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming deadlines and milestones</p>
          </div>
          <div className="space-y-4">
            {projects.filter(p => p.status === 'active').map((project, index) => (
              <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: project.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Due: {new Date(project.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${project.progress}%`,
                        backgroundColor: project.color
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};