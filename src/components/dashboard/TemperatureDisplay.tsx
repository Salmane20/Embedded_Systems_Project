import React from 'react';
import { formatTemperature } from '../../utils/formatters';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';

const TemperatureDisplay: React.FC = () => {
  const { 
    currentTemperature, 
    thresholdSettings,
    isLoading,
    refreshProgress
  } = useDashboard();
  
  // Determine temperature color based on thresholds
  const getTemperatureColor = () => {
    if (!currentTemperature) return 'text-gray-500';
    
    const { value } = currentTemperature;
    
    if (value > thresholdSettings.max) {
      return 'text-red-600';
    } else if (value < thresholdSettings.min) {
      return 'text-blue-600';
    } else {
      return 'text-green-600';
    }
  };
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="text-gray-500 flex flex-col items-center">
      <svg 
        className="animate-spin mb-2 h-10 w-10" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p>Loading temperature data...</p>
    </div>
  );
  
  // Progress bar component
  const ProgressBar = () => {
    // Calculate seconds remaining
    const secondsRemaining = Math.ceil(15 * (1 - refreshProgress / 100));
    
    return (
      <div className="w-full mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Next refresh in {secondsRemaining} seconds</span>
          <span>{Math.round(refreshProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${refreshProgress}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <Card 
      title="Live Temperature" 
      className="h-full"
    >
      <div className="flex flex-col items-center justify-center py-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : currentTemperature ? (
          <>
            <div className={`text-6xl font-bold ${getTemperatureColor()} transition-colors duration-300`}>
              {formatTemperature(currentTemperature.value, 'celsius')}
            </div>
            <div className="mt-2 text-gray-500">
              Updated {new Date(currentTemperature.timestamp).toLocaleTimeString()}
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <div className="text-sm flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block mr-2"></span>
                <span>Min: {formatTemperature(thresholdSettings.min, 'celsius')}</span>
              </div>
              <div className="text-sm flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block mr-2"></span>
                <span>Max: {formatTemperature(thresholdSettings.max, 'celsius')}</span>
              </div>
            </div>
            
            <ProgressBar />
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </Card>
  );
};

export default TemperatureDisplay;