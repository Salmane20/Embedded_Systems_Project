import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';

const NotificationsLog: React.FC = () => {
  const { alerts, resolveAlert, resetAlerts } = useDashboard();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  
  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'active') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });
  
  // Sort alerts by timestamp (newest first)
  const sortedAlerts = [...filteredAlerts].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <Card 
      title="Notifications Log" 
      headerExtra={
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetAlerts}
          disabled={!alerts.some(alert => !alert.resolved)}
        >
          Reset All
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm"
            variant={filter === 'active' ? 'primary' : 'secondary'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            size="sm"
            variant={filter === 'resolved' ? 'primary' : 'secondary'}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </Button>
        </div>
        
        <div className="max-h-80 overflow-y-auto pr-1">
          {sortedAlerts.length > 0 ? (
            sortedAlerts.map(alert => (
              <Alert 
                key={alert.id}
                alert={alert}
                onResolve={resolveAlert}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No notifications to display</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationsLog;