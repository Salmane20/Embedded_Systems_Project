import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import { formatTimeAgo, formatBatteryPercentage } from '../../utils/formatters';

const DeviceStatus: React.FC = () => {
  const { deviceStatus } = useDashboard();
  
  // Function to render the battery icon based on level
  const renderBatteryIcon = () => {
    const { batteryLevel } = deviceStatus;
    
    // Determine battery fill level
    const fillWidth = `${batteryLevel}%`;
    
    // Determine battery fill color
    let fillColor = '#22c55e'; // green-500
    if (batteryLevel < 20) {
      fillColor = '#ef4444'; // red-500
    } else if (batteryLevel < 50) {
      fillColor = '#f59e0b'; // amber-500
    }
    
    return (
      <div className="relative w-10 h-5 border-2 border-gray-400 rounded-sm">
        {/* Battery positive terminal */}
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-1 h-2 bg-gray-400 rounded-r-sm"></div>
        
        {/* Battery fill */}
        <div 
          className="absolute left-0 top-0 bottom-0 rounded-sm transition-all duration-500"
          style={{ width: fillWidth, backgroundColor: fillColor }}
        ></div>
      </div>
    );
  };
  
  return (
    <Card title="Device Status">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Connection Status</p>
            <div className="flex items-center mt-1">
              <div className={`w-3 h-3 rounded-full ${deviceStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="ml-2 font-medium">
                {deviceStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Last Activity</p>
            <p className="font-medium">
              {formatTimeAgo(deviceStatus.lastSeen)}
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-500">Battery Level</p>
          <div className="flex items-center mt-1">
            {renderBatteryIcon()}
            <span className="ml-3 font-medium">
              {formatBatteryPercentage(deviceStatus.batteryLevel)}
            </span>
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            {deviceStatus.batteryLevel < 20 
              ? 'Battery critically low! Replace soon.' 
              : deviceStatus.batteryLevel < 50
                ? 'Battery running low.' 
                : 'Battery level is good.'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DeviceStatus;