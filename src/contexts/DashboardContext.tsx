import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Alert, 
  ConnectionStatus, 
  DeviceStatus, 
  TemperatureReading, 
  TemperatureUnit, 
  ThresholdSettings 
} from '../types';
import { 
  defaultThresholdSettings, 
  generateMockAlerts, 
  generateTemperatureData, 
  mockConnectionStatus, 
  mockDeviceStatus,
  convertTemperature
} from '../utils/mockData';

interface DashboardContextProps {
  temperatureData: TemperatureReading[];
  currentTemperature: TemperatureReading | null;
  thresholdSettings: ThresholdSettings;
  deviceStatus: DeviceStatus;
  connectionStatus: ConnectionStatus;
  alerts: Alert[];
  temperatureUnit: TemperatureUnit;
  timeRange: '24h' | '7d';
  updateThresholdSettings: (settings: Partial<ThresholdSettings>) => void;
  changeTemperatureUnit: (unit: TemperatureUnit) => void;
  changeTimeRange: (range: '24h' | '7d') => void;
  refreshTemperature: () => void;
  resetAlerts: () => void;
  resolveAlert: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [temperatureData, setTemperatureData] = useState<TemperatureReading[]>([]);
  const [thresholdSettings, setThresholdSettings] = useState<ThresholdSettings>(defaultThresholdSettings);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(mockDeviceStatus);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(mockConnectionStatus);
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts());
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
  
  // Initialize with mock data
  useEffect(() => {
    const data = generateTemperatureData(temperatureUnit);
    setTemperatureData(data);
    
    // Simulate device status updates
    const statusInterval = setInterval(() => {
      setDeviceStatus(prev => ({
        ...prev,
        lastSeen: Date.now(),
        batteryLevel: Math.max(prev.batteryLevel - 0.1, 0) // Slowly decrease battery
      }));
    }, 30000);
    
    return () => clearInterval(statusInterval);
  }, []);
  
  // Update temperature data when unit changes
  useEffect(() => {
    const data = generateTemperatureData(temperatureUnit);
    setTemperatureData(data);
  }, [temperatureUnit]);
  
  // Calculate current temperature (most recent reading)
  const currentTemperature = temperatureData.length > 0 
    ? temperatureData[temperatureData.length - 1] 
    : null;
  
  // Update threshold settings with conversion if needed
  const updateThresholdSettings = (settings: Partial<ThresholdSettings>) => {
    setThresholdSettings(prev => {
      const newSettings = { ...prev, ...settings };
      
      // Convert min/max if unit is changing
      if (settings.unit && settings.unit !== prev.unit) {
        newSettings.min = convertTemperature(prev.min, prev.unit, settings.unit);
        newSettings.max = convertTemperature(prev.max, prev.unit, settings.unit);
      }
      
      return newSettings;
    });
  };
  
  // Change temperature unit
  const changeTemperatureUnit = (unit: TemperatureUnit) => {
    setTemperatureUnit(unit);
    updateThresholdSettings({ unit });
  };
  
  // Change time range for chart
  const changeTimeRange = (range: '24h' | '7d') => {
    setTimeRange(range);
  };
  
  // Refresh temperature data
  const refreshTemperature = () => {
    const newData = [...temperatureData];
    
    // Add a new reading
    const lastReading = newData[newData.length - 1];
    const baseTemp = temperatureUnit === 'celsius' ? 22 : 71.6;
    const randomVariation = (Math.random() * 10) - 5;
    
    newData.push({
      timestamp: Date.now(),
      value: parseFloat((baseTemp + randomVariation).toFixed(1)),
      unit: temperatureUnit
    });
    
    setTemperatureData(newData);
    
    // Check if temperature exceeds thresholds and create alert if needed
    const latestValue = newData[newData.length - 1].value;
    if (latestValue > thresholdSettings.max) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: `Temperature exceeded maximum threshold (${thresholdSettings.max}${temperatureUnit === 'celsius' ? '°C' : '°F'})`,
        type: 'critical',
        resolved: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (latestValue < thresholdSettings.min) {
      const newAlert: Alert = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: `Temperature below minimum threshold (${thresholdSettings.min}${temperatureUnit === 'celsius' ? '°C' : '°F'})`,
        type: 'critical',
        resolved: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };
  
  // Reset all unresolved alerts
  const resetAlerts = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, resolved: true }))
    );
  };
  
  // Resolve a specific alert
  const resolveAlert = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      )
    );
  };
  
  return (
    <DashboardContext.Provider
      value={{
        temperatureData,
        currentTemperature,
        thresholdSettings,
        deviceStatus,
        connectionStatus,
        alerts,
        temperatureUnit,
        timeRange,
        updateThresholdSettings,
        changeTemperatureUnit,
        changeTimeRange,
        refreshTemperature,
        resetAlerts,
        resolveAlert
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};