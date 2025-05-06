import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { formatTimestamp } from '../../utils/formatters';
import Toggle from '../common/Toggle';

const Header: React.FC = () => {
  const { deviceStatus, alerts, resetAlerts, resolveAlert, isPhotonOn, togglePhoton } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Count unread (unresolved) notifications
  const unreadCount = alerts.filter(alert => !alert.resolved).length;
  
  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle resolving an alert
  const handleResolveAlert = (id: string) => {
    resolveAlert(id);
  };
  
  // Handle resetting all alerts
  const handleResetAllAlerts = () => {
    resetAlerts();
  };
  
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
          
          <div className="flex items-center space-x-4">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-full transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-2 px-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={handleResetAllAlerts}
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length > 0 ? (
                      <div>
                        {alerts.map(alert => (
                          <div 
                            key={alert.id}
                            className={`px-4 py-3 border-b border-gray-100 ${!alert.resolved ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 mt-0.5 ${alert.type === 'critical' ? 'text-red-500' : alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                                {alert.type === 'critical' ? (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                ) : alert.type === 'warning' ? (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-800">{alert.message}</p>
                                <p className="mt-1 text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</p>
                              </div>
                              {!alert.resolved ? (
                                <div className="ml-2 flex-shrink-0">
                                  <button
                                    onClick={() => handleResolveAlert(alert.id)}
                                    className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div className="ml-2 flex-shrink-0">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    Resolved
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 bg-gray-50 text-right">
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Power Toggle Button */}
            <div className="flex items-center gap-2 text-white px-3 py-1.5 bg-blue-700 rounded-full shadow-sm">
              <Toggle
                isChecked={isPhotonOn}
                onChange={togglePhoton}
                leftLabel=""
                rightLabel=""
                size="md"
              />
              <span className={`text-sm font-medium ml-1 ${isPhotonOn ? 'text-green-300' : 'text-red-300'}`}>
                {isPhotonOn ? 'Power On' : 'Power Off'}
              </span>
            </div>
            
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