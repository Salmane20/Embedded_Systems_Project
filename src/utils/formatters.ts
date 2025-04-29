// Format timestamp to readable date/time
export const formatTimestamp = (timestamp: number, format: 'short' | 'full' = 'full'): string => {
  const date = new Date(timestamp);
  
  if (format === 'short') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format temperature with unit
export const formatTemperature = (value: number, unit: 'celsius' | 'fahrenheit'): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${value.toFixed(1)}${symbol}`;
};

// Format time difference to "time ago" text
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
};

// Format battery percentage
export const formatBatteryPercentage = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};