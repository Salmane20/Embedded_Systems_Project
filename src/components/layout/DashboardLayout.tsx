import React from 'react';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
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