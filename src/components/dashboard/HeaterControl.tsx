import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Toggle from '../common/Toggle';

const HeaterControl: React.FC = () => {
  const {
    isPhotonOn,
    isHeaterActive,
    heaterRPM,
    toggleHeater,
    setHeaterRPM
  } = useDashboard();

  // Handler for RPM slider
  const handleRPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaterRPM(Number(e.target.value));
  };

  return (
    <Card title="Heater Control" className="h-full">
      <div className="space-y-6">
        {/* Temperature Control Toggle */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Heating System</h3>
            <p className="text-sm text-gray-600 mt-1">Control temperature regulation</p>
          </div>
          <Toggle
            isChecked={isHeaterActive}
            onChange={toggleHeater}
            leftLabel="Off"
            rightLabel="On"
            size="md"
            disabled={!isPhotonOn}
          />
        </div>

        {/* RPM Control */}
        <div className={`transition-opacity duration-300 ${isHeaterActive && isPhotonOn ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Heater RPM</h3>
            <p className="text-sm text-gray-600 mt-1">Adjust heating intensity</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700 font-medium">Current Setting:</span>
              <span className="text-lg font-bold text-blue-600">
                {heaterRPM.toLocaleString()} RPM
              </span>
            </div>
            
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={heaterRPM}
              onChange={handleRPMChange}
              disabled={!isHeaterActive || !isPhotonOn}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            
            <div className="flex justify-between text-xs text-gray-600 font-medium mt-1">
              <span>Low (1,000)</span>
              <span>High (5,000)</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="flex items-center bg-gray-50 rounded-lg p-3">
            <div className={`w-4 h-4 rounded-full ${isHeaterActive && isPhotonOn ? 'bg-orange-500' : 'bg-gray-300'} ring-2 ring-white`}></div>
            <span className="ml-3 font-medium text-gray-800">
              {isPhotonOn 
                ? (isHeaterActive ? `Active (${heaterRPM.toLocaleString()} RPM)` : 'Standby') 
                : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-3 pl-2">
            {isHeaterActive && isPhotonOn 
              ? 'Temperature regulation system is running' 
              : isPhotonOn 
                ? 'Heater is ready but not active' 
                : 'System is powered off'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HeaterControl; 