import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Button from '../common/Button';

const ControlPanel: React.FC = () => {
  const { 
    refreshTemperature, 
    resetAlerts,
    refreshProgress,
    isLoading
  } = useDashboard();
  
  // Calculate seconds remaining
  const secondsRemaining = Math.ceil(15 * (1 - refreshProgress / 100));
  
  return (
    <Card title="Control Panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={refreshTemperature}
          className="w-full relative overflow-hidden"
          disabled={isLoading}
        >
          <div className="relative z-10 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Refresh Data
          </div>
          {/* Progress bar overlay */}
          <div 
            className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 transition-all duration-1000 ease-linear"
            style={{ width: `${refreshProgress}%` }}
          />
        </Button>
        
        <Button
          onClick={resetAlerts}
          variant="secondary"
          className="w-full"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          Reset Alerts
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 border-t pt-3">
        <h3 className="font-medium mb-1">System Information</h3>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>Model:</span>
            <span className="font-medium">Photon Temperature v2.1</span>
          </li>
          <li className="flex justify-between">
            <span>Firmware:</span>
            <span className="font-medium">1.3.5</span>
          </li>
          <li className="flex justify-between">
            <span>Last Maintenance:</span>
            <span className="font-medium">2025-01-15</span>
          </li>
          <li className="flex justify-between">
            <span>Auto-refresh:</span>
            <span className="font-medium">
              <span className={secondsRemaining < 5 ? "text-blue-600 animate-pulse" : ""}>
                {secondsRemaining}s remaining
              </span>
            </span>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default ControlPanel;