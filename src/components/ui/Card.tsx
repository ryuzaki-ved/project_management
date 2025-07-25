import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-sm
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-600' : ''}
        ${paddingClasses[padding]}
        ${className}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};