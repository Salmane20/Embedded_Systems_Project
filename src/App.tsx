import React from 'react';
import { DashboardProvider } from './contexts/DashboardContext';
import DashboardLayout from './components/layout/DashboardLayout';
import TemperatureDisplay from './components/dashboard/TemperatureDisplay';
import TemperatureChart from './components/dashboard/TemperatureChart';
import ThresholdSettings from './components/dashboard/ThresholdSettings';
import NotificationsLog from './components/dashboard/NotificationsLog';
import DeviceStatus from './components/dashboard/DeviceStatus';
import ControlPanel from './components/dashboard/ControlPanel';
import ConnectionStatus from './components/dashboard/ConnectionStatus';
import HeaterControl from './components/dashboard/HeaterControl';
import SprayerControl from './components/dashboard/SprayerControl';

const App: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1 - Temperature Display */}
          <div className="lg:col-span-1">
            <TemperatureDisplay />
          </div>
          <div className="md:col-span-2">
            <TemperatureChart />
          </div>

          {/* Row 2 - Device Controls - Larger Boxes */}
          <div className="md:col-span-1 lg:col-span-2">
            <HeaterControl />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <SprayerControl />
          </div>
          
          {/* Row 3 - Threshold under Heater Control */}
          <div className="md:col-span-1 lg:col-span-2">
            <ThresholdSettings />
          </div>

          {/* Row 4 - Status Boxes in equal sizes */}
          <div className="md:col-span-1 lg:col-span-1">
            <DeviceStatus />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <ConnectionStatus />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <ControlPanel />
          </div>

          {/* Row 5 - Logs */}
          <div className="md:col-span-2 lg:col-span-3">
            <NotificationsLog />
          </div>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default App;