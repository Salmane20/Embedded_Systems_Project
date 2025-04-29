import React, { useState, useEffect } from 'react';
import { Alert as AlertType } from '../../types';
import { formatTimestamp } from '../../utils/formatters';

interface AlertProps {
  alert: AlertType;
  onResolve?: (id: string) => void;
  showTimestamp?: boolean;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  alert,
  onResolve,
  showTimestamp = true,
  dismissible = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Determine background color based on alert type and resolved status
  const getBgColor = () => {
    if (alert.resolved) return 'bg-gray-100 border-gray-300';
    
    switch (alert.type) {
      case 'critical':
        return 'bg-red-50 border-red-300';
      case 'warning':
        return 'bg-yellow-50 border-yellow-300';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-300';
    }
  };
  
  // Determine text color based on alert type and resolved status
  const getTextColor = () => {
    if (alert.resolved) return 'text-gray-700';
    
    switch (alert.type) {
      case 'critical':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
      default:
        return 'text-blue-700';
    }
  };
  
  // Handle resolve button click
  const handleResolve = () => {
    if (onResolve) {
      onResolve(alert.id);
    }
  };
  
  // Flash effect for critical unresolved alerts
  useEffect(() => {
    if (alert.type === 'critical' && !alert.resolved) {
      const interval = setInterval(() => {
        setIsFlashing(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [alert.type, alert.resolved]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`
        ${getBgColor()} 
        ${isFlashing && !alert.resolved && alert.type === 'critical' ? 'animate-pulse' : ''}
        border rounded-md p-3 mb-2 transition-all duration-200
      `}
    >
      <div className="flex justify-between">
        <div className={`flex-1 ${getTextColor()}`}>
          <p className="font-medium">{alert.message}</p>
          {showTimestamp && (
            <p className="text-xs opacity-80 mt-1">
              {formatTimestamp(alert.timestamp)}
            </p>
          )}
        </div>
        
        <div className="flex items-start ml-3">
          {dismissible && !alert.resolved && (
            <button
              onClick={handleResolve}
              className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <span className="sr-only">Resolve</span>
              {/* Checkmark icon */}
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;