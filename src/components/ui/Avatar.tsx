import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  status,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
      {status && (
        <div className={`
          absolute bottom-0 right-0 rounded-full ring-2 ring-white
          ${statusColors[status]}
          ${size === 'sm' ? 'h-2.5 w-2.5' : size === 'md' ? 'h-3 w-3' : 'h-3.5 w-3.5'}
        `} />
      )}
    </div>
  );
};