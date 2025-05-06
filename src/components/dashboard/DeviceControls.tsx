import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Toggle from '../common/Toggle';
import Button from '../common/Button';

const DeviceControls: React.FC = () => {
  const {
    isPhotonOn,
    isHeaterActive,
    isSprayerActive,
    heaterRPM,
    toggleHeater,
    toggleSprayer,
    setHeaterRPM
  } = useDashboard();

  // Handler for RPM slider
  const handleRPMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaterRPM(Number(e.target.value));
  };

  return (
    <Card title="Device Controls" className="h-full">
      <div className="space-y-6">
        {/* Heater Controls - Only shown when Photon is on */}
        {isPhotonOn && (
          <div className={`space-y-3 pb-4 border-b border-gray-100 transition-opacity duration-300 ${isPhotonOn ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-800">Temperature Control</h3>
                <p className="text-sm text-gray-500">Manage heating system</p>
              </div>
              <Toggle
                isChecked={isHeaterActive}
                onChange={toggleHeater}
                leftLabel="Off"
                rightLabel="On"
                size="md"
              />
            </div>

            {/* RPM Control - Only shown when heater is active */}
            {isHeaterActive && (
              <div className="pt-2 space-y-2 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Heater RPM:</span>
                  <span className="text-sm font-medium">
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1,000</span>
                  <span>5,000</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Water Sprayer Control - Only enabled when heater is active */}
        {isPhotonOn && (
          <div className={`transition-opacity duration-300 ${isPhotonOn ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-800">Water Sprayer</h3>
                <p className="text-sm text-gray-500">
                  {isHeaterActive 
                    ? "Cool down the system" 
                    : "Activate heater to enable sprayer"}
                </p>
              </div>
              <Button
                variant={isSprayerActive ? "primary" : "secondary"}
                size="md"
                onClick={toggleSprayer}
                disabled={!isHeaterActive}
                className="min-w-[100px]"
              >
                {isSprayerActive ? "Active" : "Inactive"}
              </Button>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">System Status</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <div className={`w-3 h-3 rounded-full ${isPhotonOn ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="mt-1 text-xs text-gray-600">Photon</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <div className={`w-3 h-3 rounded-full ${isHeaterActive ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              <span className="mt-1 text-xs text-gray-600">Heater</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
              <div className={`w-3 h-3 rounded-full ${isSprayerActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="mt-1 text-xs text-gray-600">Sprayer</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DeviceControls; 