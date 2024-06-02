import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card hover className="group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className="h-6 w-6" 
            style={{ color }}
          />
        </div>
      </div>
    </Card>
  );
};