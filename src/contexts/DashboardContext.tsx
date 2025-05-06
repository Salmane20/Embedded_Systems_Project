import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Alert, 
  ConnectionStatus, 
  DeviceStatus, 
  TemperatureReading, 
  ThresholdSettings 
} from '../types';
import { 
  defaultThresholdSettings, 
  generateMockAlerts, 
  generateTemperatureData, 
  mockConnectionStatus, 
  mockDeviceStatus
} from '../utils/mockData';

// ThingSpeak configuration
const THINGSPEAK_API_KEY = 'B9XCWXVC99VG7OL1';
const THINGSPEAK_READ_URL = `https://api.thingspeak.com/channels/2431893/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=20`;
const THINGSPEAK_LATEST_URL = `https://api.thingspeak.com/channels/2431893/feeds/last.json?api_key=${THINGSPEAK_API_KEY}`;

interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1: string; // Temperature
  field2: string; // Voltage
  field3: string; // RPM
  field4: string; // Alert status
}

interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakFeed[];
}

interface DashboardContextProps {
  temperatureData: TemperatureReading[];
  currentTemperature: TemperatureReading | null;
  thresholdSettings: ThresholdSettings;
  deviceStatus: DeviceStatus;
  connectionStatus: ConnectionStatus;
  alerts: Alert[];
  timeRange: '24h' | '7d';
  isLoading: boolean;
  refreshProgress: number;
  isPhotonOn: boolean;
  isHeaterActive: boolean;
  isSprayerActive: boolean;
  heaterRPM: number;
  showWarningPopup: boolean;
  updateThresholdSettings: (settings: Partial<ThresholdSettings>) => void;
  changeTimeRange: (range: '24h' | '7d') => void;
  refreshTemperature: () => void;
  resetAlerts: () => void;
  resolveAlert: (id: string) => void;
  togglePhoton: () => void;
  toggleHeater: () => void;
  toggleSprayer: () => void;
  setHeaterRPM: (rpm: number) => void;
  dismissWarning: () => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [temperatureData, setTemperatureData] = useState<TemperatureReading[]>([]);
  const [thresholdSettings, setThresholdSettings] = useState<ThresholdSettings>(defaultThresholdSettings);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(mockDeviceStatus);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(mockConnectionStatus);
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts());
  const [timeRange, setTimeRange] = useState<'24h' | '7d'>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshProgress, setRefreshProgress] = useState<number>(0);
  const [isPhotonOn, setIsPhotonOn] = useState<boolean>(true);
  const [isHeaterActive, setIsHeaterActive] = useState<boolean>(false);
  const [isSprayerActive, setIsSprayerActive] = useState<boolean>(false);
  const [heaterRPM, setHeaterRPM] = useState<number>(1000);
  const [showWarningPopup, setShowWarningPopup] = useState<boolean>(false);
  
  // Function to fetch data from ThingSpeak
  const fetchThingSpeakData = useCallback(async (): Promise<TemperatureReading[]> => {
    try {
      const response = await fetch(THINGSPEAK_READ_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data: ThingSpeakResponse = await response.json();
      
      // Convert ThingSpeak feeds to TemperatureReading format
      const readings = data.feeds.map(feed => {
        // Parse temperature from field1
        const temperature = parseFloat(feed.field1);
        
        return {
          timestamp: new Date(feed.created_at).getTime(),
          value: temperature,
          unit: 'celsius'
        };
      });
      
      // Filter out any invalid readings
      return readings.filter(reading => !isNaN(reading.value));
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      return [];
    }
  }, []);
  
  // Function to fetch the latest temperature from ThingSpeak
  const fetchLatestTemperature = useCallback(async (): Promise<TemperatureReading | null> => {
    try {
      const response = await fetch(THINGSPEAK_LATEST_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const feed: ThingSpeakFeed = await response.json();
      
      // Parse temperature from field1
      const temperature = parseFloat(feed.field1);
      
      if (isNaN(temperature)) {
        return null;
      }
      
      // Check if temperature exceeds thresholds and create alert if needed
      if (temperature > 25 && !showWarningPopup && !isHeaterActive) {
        setShowWarningPopup(true);
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          message: `Temperature exceeded 25°C! Consider activating heater control.`,
          type: 'critical',
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
      else if (temperature > thresholdSettings.max) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          message: `Temperature exceeded maximum threshold (${thresholdSettings.max}°C)`,
          type: 'critical',
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      } else if (temperature < thresholdSettings.min) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          message: `Temperature below minimum threshold (${thresholdSettings.min}°C)`,
          type: 'critical',
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
      
      return {
        timestamp: new Date(feed.created_at).getTime(),
        value: temperature,
        unit: 'celsius'
      };
    } catch (error) {
      console.error('Error fetching latest ThingSpeak data:', error);
      return null;
    }
  }, [thresholdSettings, isHeaterActive, showWarningPopup]);
  
  // Refresh temperature data function (memoized with useCallback)
  const refreshTemperature = useCallback(() => {
    if (!isPhotonOn) return; // Don't update if Photon is off
    
    setIsLoading(true);
    setRefreshProgress(0);
    
    // Fetch the latest temperature from ThingSpeak
    fetchLatestTemperature()
      .then(reading => {
        if (reading) {
          setTemperatureData(prev => [...prev, reading]);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error refreshing temperature:', error);
        setIsLoading(false);
      });
  }, [fetchLatestTemperature, isPhotonOn]);
  
  // Initialize with ThingSpeak data
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch initial data from ThingSpeak
    fetchThingSpeakData()
      .then(data => {
        if (data.length > 0) {
          setTemperatureData(data);
        } else {
          // Fallback to mock data if no ThingSpeak data available
          setTemperatureData(generateTemperatureData('celsius'));
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error initializing data:', error);
        // Fallback to mock data on error
        setTemperatureData(generateTemperatureData('celsius'));
        setIsLoading(false);
      });
    
    // Simulate device status updates
    const statusInterval = setInterval(() => {
      setDeviceStatus(prev => ({
        ...prev,
        lastSeen: Date.now(),
        batteryLevel: Math.max(prev.batteryLevel - 0.1, 0) // Slowly decrease battery
      }));
    }, 30000);
    
    return () => clearInterval(statusInterval);
  }, [fetchThingSpeakData]);
  
  // Set up automatic refresh every 15 seconds
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;
    
    if (isPhotonOn) {
      refreshInterval = setInterval(() => {
        refreshTemperature();
      }, 15000); // 15 seconds
    }
    
    // Progress tracking interval - update every second
    const progressInterval = setInterval(() => {
      if (isPhotonOn) {
        setRefreshProgress(prev => {
          // Reset to 0 after a refresh and start over
          if (prev >= 100) return 0;
          // Increment by ~6.67% each second to reach 100% in 15 seconds
          return Math.min(prev + (100 / 15), 100);
        });
      }
    }, 1000);
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
      clearInterval(progressInterval);
    };
  }, [refreshTemperature, isPhotonOn]);
  
  // Update device status when Photon is toggled
  useEffect(() => {
    setDeviceStatus(prev => ({
      ...prev,
      isOnline: isPhotonOn
    }));
    
    if (!isPhotonOn) {
      // Reset controls when Photon is turned off
      setIsHeaterActive(false);
      setIsSprayerActive(false);
    }
  }, [isPhotonOn]);
  
  // Calculate current temperature (most recent reading)
  const currentTemperature = temperatureData.length > 0 
    ? temperatureData[temperatureData.length - 1] 
    : null;
  
  // Toggle Photon on/off
  const togglePhoton = () => {
    setIsPhotonOn(prev => !prev);
  };
  
  // Toggle heater
  const toggleHeater = () => {
    setIsHeaterActive(prev => !prev);
    
    // Dismiss warning when heater is activated
    if (!isHeaterActive) {
      setShowWarningPopup(false);
    }
  };
  
  // Toggle sprayer
  const toggleSprayer = () => {
    setIsSprayerActive(prev => !prev);
  };
  
  // Dismiss warning popup
  const dismissWarning = () => {
    setShowWarningPopup(false);
  };
  
  // Update threshold settings
  const updateThresholdSettings = (settings: Partial<ThresholdSettings>) => {
    setThresholdSettings(prev => {
      const newSettings = { ...prev, ...settings };
      return newSettings;
    });
  };
  
  // Change time range for chart
  const changeTimeRange = (range: '24h' | '7d') => {
    setIsLoading(true);
    
    // Simulate loading when changing time range
    setTimeout(() => {
      setTimeRange(range);
      setIsLoading(false);
    }, 1000);
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
        timeRange,
        isLoading,
        refreshProgress,
        isPhotonOn,
        isHeaterActive,
        isSprayerActive,
        heaterRPM,
        showWarningPopup,
        updateThresholdSettings,
        changeTimeRange,
        refreshTemperature,
        resetAlerts,
        resolveAlert,
        togglePhoton,
        toggleHeater,
        toggleSprayer,
        setHeaterRPM,
        dismissWarning
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