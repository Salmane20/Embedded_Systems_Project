import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatTemperature } from '../../utils/formatters';

const ThresholdSettings: React.FC = () => {
  const { thresholdSettings, updateThresholdSettings } = useDashboard();
  
  const [minTemp, setMinTemp] = useState(thresholdSettings.min);
  const [maxTemp, setMaxTemp] = useState(thresholdSettings.max);
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle save button click
  const handleSave = () => {
    updateThresholdSettings({
      min: minTemp,
      max: maxTemp
    });
    setIsEditing(false);
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    setMinTemp(thresholdSettings.min);
    setMaxTemp(thresholdSettings.max);
    setIsEditing(false);
  };
  
  return (
    <Card title="Threshold Settings">
      <div className="space-y-5">
        {isEditing ? (
          <>
            <div className="space-y-3">
              <label htmlFor="minTemp" className="block text-sm font-medium text-gray-700">
                Minimum Temperature ({thresholdSettings.unit === 'celsius' ? '°C' : '°F'})
              </label>
              <input
                type="number"
                id="minTemp"
                value={minTemp}
                onChange={(e) => setMinTemp(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                step="0.1"
              />
            </div>
            
            <div className="space-y-3">
              <label htmlFor="maxTemp" className="block text-sm font-medium text-gray-700">
                Maximum Temperature ({thresholdSettings.unit === 'celsius' ? '°C' : '°F'})
              </label>
              <input
                type="number"
                id="maxTemp"
                value={maxTemp}
                onChange={(e) => setMaxTemp(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                step="0.1"
              />
            </div>
            
            <div className="flex space-x-3 pt-3">
              <Button variant="primary" className="flex-1" onClick={handleSave}>Save Changes</Button>
              <Button variant="secondary" className="flex-1" onClick={handleCancel}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm font-medium text-gray-600 mb-1">Minimum Temperature</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTemperature(thresholdSettings.min, thresholdSettings.unit)}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <p className="text-sm font-medium text-gray-600 mb-1">Maximum Temperature</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatTemperature(thresholdSettings.max, thresholdSettings.unit)}
                </p>
              </div>
            </div>
            
            <div className="pt-3">
              <Button 
                variant="primary" 
                className="w-full py-3 shadow-md" 
                onClick={() => setIsEditing(true)}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              >
                Edit Thresholds
              </Button>
            </div>
            
            <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-200">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The system will generate alerts when temperature readings fall outside these thresholds.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ThresholdSettings;