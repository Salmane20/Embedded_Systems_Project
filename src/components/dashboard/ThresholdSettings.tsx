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
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label htmlFor="minTemp" className="block text-sm font-medium text-gray-700">
                Minimum Temperature ({thresholdSettings.unit === 'celsius' ? '°C' : '°F'})
              </label>
              <input
                type="number"
                id="minTemp"
                value={minTemp}
                onChange={(e) => setMinTemp(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                step="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="maxTemp" className="block text-sm font-medium text-gray-700">
                Maximum Temperature ({thresholdSettings.unit === 'celsius' ? '°C' : '°F'})
              </label>
              <input
                type="number"
                id="maxTemp"
                value={maxTemp}
                onChange={(e) => setMaxTemp(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                step="0.1"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Minimum Temperature</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatTemperature(thresholdSettings.min, thresholdSettings.unit)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Maximum Temperature</p>
                <p className="text-xl font-semibold text-red-600">
                  {formatTemperature(thresholdSettings.max, thresholdSettings.unit)}
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button onClick={() => setIsEditing(true)}>Edit Thresholds</Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>The system will generate alerts when temperature readings fall outside these thresholds.</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ThresholdSettings;