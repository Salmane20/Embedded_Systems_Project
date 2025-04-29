import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  headerExtra?: ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  titleClassName = '',
  contentClassName = '',
  headerExtra
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h2 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>{title}</h2>
        {headerExtra && <div>{headerExtra}</div>}
      </div>
      <div className={`p-4 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;