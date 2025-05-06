import React from 'react';
import Header from './Header';
import { useDashboard } from '../../contexts/DashboardContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isPhotonOn } = useDashboard();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {children}
        
        {/* Not Connected Overlay */}
        {!isPhotonOn && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex flex-col items-center justify-center z-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
              <svg 
                className="h-16 w-16 text-gray-400 mx-auto mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072m-3.182 10.606a1 1 0 10-1.414-1.414 1 1 0 001.414 1.414z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M3 3l18 18" 
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Connected</h2>
              <p className="text-gray-600 mb-4">
                The temperature monitoring system is currently powered off. 
                Turn on the device using the power toggle in the header to view temperature data.
              </p>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p>To reconnect: Click the power toggle in the navigation bar</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-t border-gray-700 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">TempSense IoT Dashboard</p>
              <p className="text-sm text-gray-300">© {new Date().getFullYear()} | System Version 1.2.3</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm font-medium mb-2">Developed by:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>Salmane El Mansour Billah</li>
                <li>Rania Terrab</li>
                <li>Ziyad Boudhim</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;