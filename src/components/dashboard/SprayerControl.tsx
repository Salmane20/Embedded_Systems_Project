import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Button from '../common/Button';

const SprayerControl: React.FC = () => {
  const {
    isPhotonOn,
    isHeaterActive,
    isSprayerActive,
    toggleSprayer
  } = useDashboard();

  return (
    <Card title="Water Sprayer Control" className="h-full">
      <div className="space-y-6">
        {/* Water Sprayer Control */}
        <div className="pb-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Cooling System</h3>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            {isPhotonOn 
              ? isHeaterActive 
                ? "Activate to cool down the system" 
                : "Heater must be active to use sprayer"
              : "System is powered off"}
          </p>
          
          <Button
            variant={isSprayerActive ? "primary" : "secondary"}
            size="lg"
            onClick={toggleSprayer}
            disabled={!isHeaterActive || !isPhotonOn}
            className="w-full py-4 text-base font-medium shadow-md"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14a7 7 0 01-7 7m0 0a7 7 0 01-7-7m14 0a7 7 0 00-7-7m0 0a7 7 0 00-7 7" />
              </svg>
            }
          >
            {isSprayerActive ? "Sprayer Active" : "Activate Sprayer"}
          </Button>
        </div>
        
        {/* Status Information */}
        <div>
          <div className="flex items-center bg-gray-50 rounded-lg p-3 mb-5">
            <div className={`w-4 h-4 rounded-full ${isSprayerActive && isHeaterActive && isPhotonOn ? 'bg-blue-500' : 'bg-gray-300'} ring-2 ring-white`}></div>
            <span className="ml-3 font-medium text-gray-800">
              {isPhotonOn 
                ? (isHeaterActive 
                  ? (isSprayerActive ? 'Active - Cooling' : 'Ready') 
                  : 'Disabled - Requires Heater') 
                : 'Offline'}
            </span>
          </div>
          
          {/* Operation Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Operation Information</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <span className="bg-blue-100 rounded-full p-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Water sprayer cools down system by 2-3°C
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 rounded-full p-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Automatic shutoff after 5 minutes
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 rounded-full p-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                Only operational when heater is active
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 rounded-full p-1 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </span>
                Uses approximately 30ml water per minute
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SprayerControl; 