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
    <div className={`bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className={`text-lg font-semibold text-gray-800 ${titleClassName}`}>{title}</h2>
        {headerExtra && <div>{headerExtra}</div>}
      </div>
      <div className={`p-5 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;