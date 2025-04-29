export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface TemperatureReading {
  timestamp: number;
  value: number;
  unit: TemperatureUnit;
}

export interface ThresholdSettings {
  min: number;
  max: number;
  unit: TemperatureUnit;
}

export interface DeviceStatus {
  isOnline: boolean;
  lastSeen: number;
  batteryLevel: number;
}

export interface Alert {
  id: string;
  timestamp: number;
  message: string;
  type: 'warning' | 'critical' | 'info';
  resolved: boolean;
}

export interface ConnectionStatus {
  isConnected: boolean;
  provider: string;
  lastConnected: number;
}