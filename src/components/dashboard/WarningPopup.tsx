import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Button from '../common/Button';

const WarningPopup: React.FC = () => {
  const { showWarningPopup, dismissWarning, toggleHeater } = useDashboard();

  if (!showWarningPopup) return null;

  const handleActivateHeater = () => {
    toggleHeater();
    // Warning will be automatically dismissed in the toggleHeater function
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all animate-bounce-once">
        {/* Warning header */}
        <div className="bg-red-600 px-6 py-4">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-white mr-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">Temperature Alert</h3>
          </div>
        </div>
        
        {/* Warning content */}
        <div className="px-6 py-4">
          <p className="text-gray-700 text-base mb-4">
            The temperature has exceeded 25°C. Activate the heater system to regulate temperature?
          </p>
          
          <div className="flex justify-between items-center space-x-3 mt-6">
            <Button 
              variant="secondary" 
              onClick={dismissWarning}
              className="flex-1"
            >
              Dismiss
            </Button>
            <Button 
              variant="primary" 
              onClick={handleActivateHeater}
              className="flex-1"
            >
              Activate Heater
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup; 