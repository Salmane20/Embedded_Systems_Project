import React, { useMemo } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatTimestamp } from '../../utils/formatters';

const TemperatureChart: React.FC = () => {
  const { 
    temperatureData, 
    temperatureUnit, 
    timeRange, 
    changeTimeRange,
    thresholdSettings 
  } = useDashboard();
  
  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!temperatureData.length) return [];
    
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (timeRange === '24h') {
      return temperatureData.filter(reading => (now - reading.timestamp) <= dayInMs);
    }
    
    return temperatureData;
  }, [temperatureData, timeRange]);
  
  // Calculate min and max values for chart scaling
  const minValue = useMemo(() => {
    if (!filteredData.length) return 0;
    return Math.min(...filteredData.map(d => d.value)) - 5;
  }, [filteredData]);
  
  const maxValue = useMemo(() => {
    if (!filteredData.length) return 50;
    return Math.max(...filteredData.map(d => d.value)) + 5;
  }, [filteredData]);
  
  // Calculate chart dimensions
  const chartWidth = 1000;
  const chartHeight = 200;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  
  // Generate SVG path for temperature line
  const generatePath = () => {
    if (!filteredData.length) return '';
    
    const xScale = (i: number) => {
      return padding.left + (i / (filteredData.length - 1)) * (chartWidth - padding.left - padding.right);
    };
    
    const yScale = (value: number) => {
      return chartHeight - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom);
    };
    
    let path = `M ${xScale(0)} ${yScale(filteredData[0].value)}`;
    
    for (let i = 1; i < filteredData.length; i++) {
      path += ` L ${xScale(i)} ${yScale(filteredData[i].value)}`;
    }
    
    return path;
  };
  
  // Generate threshold lines
  const minThresholdY = chartHeight - padding.bottom - ((thresholdSettings.min - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom);
  const maxThresholdY = chartHeight - padding.bottom - ((thresholdSettings.max - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom);
  
  // Generate time labels for x-axis
  const timeLabels = useMemo(() => {
    if (!filteredData.length) return [];
    
    const step = Math.floor(filteredData.length / 6);
    const labels = [];
    
    for (let i = 0; i < filteredData.length; i += step) {
      if (labels.length < 6) { // Limit to 6 labels
        labels.push({
          position: (i / (filteredData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left,
          label: formatTimestamp(filteredData[i].timestamp, 'short')
        });
      }
    }
    
    return labels;
  }, [filteredData, chartWidth, padding.left, padding.right]);
  
  return (
    <Card 
      title="Temperature Trend" 
      headerExtra={
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={timeRange === '24h' ? 'primary' : 'secondary'}
            onClick={() => changeTimeRange('24h')}
          >
            24h
          </Button>
          <Button 
            size="sm"
            variant={timeRange === '7d' ? 'primary' : 'secondary'}
            onClick={() => changeTimeRange('7d')}
          >
            7d
          </Button>
        </div>
      }
    >
      <div className="h-64 w-full">
        {filteredData.length > 0 ? (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            {/* Chart background */}
            <rect
              x={padding.left}
              y={padding.top}
              width={chartWidth - padding.left - padding.right}
              height={chartHeight - padding.top - padding.bottom}
              fill="#f9fafb"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            
            {/* Threshold lines */}
            <line
              x1={padding.left}
              y1={maxThresholdY}
              x2={chartWidth - padding.right}
              y2={maxThresholdY}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1={padding.left}
              y1={minThresholdY}
              x2={chartWidth - padding.right}
              y2={minThresholdY}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            
            {/* Temperature path */}
            <path
              d={generatePath()}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
            
            {/* X-axis */}
            <line
              x1={padding.left}
              y1={chartHeight - padding.bottom}
              x2={chartWidth - padding.right}
              y2={chartHeight - padding.bottom}
              stroke="#9ca3af"
              strokeWidth="1"
            />
            
            {/* Y-axis */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={chartHeight - padding.bottom}
              stroke="#9ca3af"
              strokeWidth="1"
            />
            
            {/* Time labels */}
            {timeLabels.map((item, index) => (
              <g key={index}>
                <line
                  x1={item.position}
                  y1={chartHeight - padding.bottom}
                  x2={item.position}
                  y2={chartHeight - padding.bottom + 5}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                <text
                  x={item.position}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {item.label}
                </text>
              </g>
            ))}
            
            {/* Data points */}
            {filteredData.map((reading, index) => {
              const x = padding.left + (index / (filteredData.length - 1)) * (chartWidth - padding.left - padding.right);
              const y = chartHeight - padding.bottom - ((reading.value - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom);
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const value = minValue + ratio * (maxValue - minValue);
              const y = chartHeight - padding.bottom - ratio * (chartHeight - padding.top - padding.bottom);
              
              return (
                <g key={index}>
                  <line
                    x1={padding.left - 5}
                    y1={y}
                    x2={padding.left}
                    y2={y}
                    stroke="#9ca3af"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {value.toFixed(0) + (temperatureUnit === 'celsius' ? '°C' : '°F')}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No temperature data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TemperatureChart;