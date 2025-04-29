import { Alert, ConnectionStatus, DeviceStatus, TemperatureReading, ThresholdSettings } from '../types';

// Generate temperature readings for the past 7 days
export const generateTemperatureData = (
  unit: 'celsius' | 'fahrenheit',
  days = 7
): TemperatureReading[] => {
  const now = Date.now();
  const data: TemperatureReading[] = [];
  const dayInMs = 24 * 60 * 60 * 1000;
  const readingsPerDay = 24; // One reading per hour
  
  for (let i = days; i >= 0; i--) {
    const dayStart = now - i * dayInMs;
    
    for (let j = 0; j < readingsPerDay; j++) {
      // Base temperature around 22°C with some random variation
      const baseTemp = unit === 'celsius' ? 22 : 71.6;
      const randomVariation = (Math.random() * 10) - 5; // -5 to +5
      const timestamp = dayStart + (j * (dayInMs / readingsPerDay));
      
      data.push({
        timestamp,
        value: parseFloat((baseTemp + randomVariation).toFixed(1)),
        unit
      });
    }
  }
  
  return data;
};

// Generate some mock alerts
export const generateMockAlerts = (): Alert[] => {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  return [
    {
      id: '1',
      timestamp: now - (2 * hourInMs),
      message: 'Temperature exceeded maximum threshold (30°C)',
      type: 'critical',
      resolved: false
    },
    {
      id: '2',
      timestamp: now - (5 * hourInMs),
      message: 'Device battery low (15%)',
      type: 'warning',
      resolved: false
    },
    {
      id: '3',
      timestamp: now - (12 * hourInMs),
      message: 'Connection to cloud interrupted',
      type: 'warning',
      resolved: true
    },
    {
      id: '4',
      timestamp: now - (24 * hourInMs),
      message: 'Temperature below minimum threshold (10°C)',
      type: 'critical',
      resolved: true
    }
  ];
};

// Default threshold settings
export const defaultThresholdSettings: ThresholdSettings = {
  min: 15,
  max: 30,
  unit: 'celsius'
};

// Device status
export const mockDeviceStatus: DeviceStatus = {
  isOnline: true,
  lastSeen: Date.now() - (2 * 60 * 1000), // 2 minutes ago
  batteryLevel: 75
};

// Connection status
export const mockConnectionStatus: ConnectionStatus = {
  isConnected: true,
  provider: 'ThingSpeak',
  lastConnected: Date.now() - (5 * 60 * 1000) // 5 minutes ago
};

// Convert temperature between units
export const convertTemperature = (value: number, fromUnit: 'celsius' | 'fahrenheit', toUnit: 'celsius' | 'fahrenheit'): number => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return parseFloat(((value * 9/5) + 32).toFixed(1));
  } else {
    return parseFloat(((value - 32) * 5/9).toFixed(1));
  }
};