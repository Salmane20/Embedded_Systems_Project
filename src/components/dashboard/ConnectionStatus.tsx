import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import { formatTimeAgo } from '../../utils/formatters';

const ConnectionStatus: React.FC = () => {
  const { connectionStatus } = useDashboard();
  
  return (
    <Card title="Cloud Connection">
      <div className="flex items-center">
        <div className="relative mr-4">
          {/* Cloud icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-12 w-12 ${connectionStatus.isConnected ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          
          {/* Connection status indicator */}
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
        </div>
        
        <div>
          <p className="font-medium">
            {connectionStatus.isConnected 
              ? 'Connected to cloud' 
              : 'Disconnected from cloud'}
          </p>
          <p className="text-sm text-gray-500">
            {connectionStatus.provider} - Last sync {formatTimeAgo(connectionStatus.lastConnected)}
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        {connectionStatus.isConnected 
          ? 'Data is being synchronized with the cloud service.' 
          : 'Cloud connection lost. Data is being stored locally and will sync when connection is restored.'}
      </div>
    </Card>
  );
};

export default ConnectionStatus;