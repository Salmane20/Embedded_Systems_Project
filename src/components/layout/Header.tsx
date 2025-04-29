import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';

const Header: React.FC = () => {
  const { deviceStatus } = useDashboard();
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">TempSense IoT Dashboard</h1>
              <p className="text-sm text-blue-100">Real-time Temperature Monitoring System</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-white bg-blue-700 px-3 py-1.5 rounded-full shadow-sm">
              Device: 
              <span className={`ml-1 font-medium ${deviceStatus.isOnline ? 'text-green-300' : 'text-red-300'}`}>
                {deviceStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;