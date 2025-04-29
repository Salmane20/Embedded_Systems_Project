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

const App: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1 */}
          <div className="lg:col-span-1">
            <TemperatureDisplay />
          </div>
          <div className="md:col-span-2">
            <TemperatureChart />
          </div>

          {/* Row 2 */}
          <div>
            <ThresholdSettings />
          </div>
          <div>
            <DeviceStatus />
          </div>
          <div>
            <ConnectionStatus />
          </div>

          {/* Row 3 */}
          <div className="md:col-span-2">
            <NotificationsLog />
          </div>
          <div>
            <ControlPanel />
          </div>
        </div>
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default App;