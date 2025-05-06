# ThingSpeak Setup Guide

This guide provides step-by-step instructions for setting up a ThingSpeak channel to store and visualize data from our Particle Photon temperature monitoring system.

## 1. Create a ThingSpeak Account

1. Visit [ThingSpeak.com](https://thingspeak.com/)
2. Click on "Sign Up" to create a new account
3. Complete the registration process with your email

## 2. Create a New Channel

1. Log in to your ThingSpeak account
2. Click on "Channels" → "My Channels"
3. Click on "New Channel"
4. Configure your channel with the following settings:

   - **Name**: Temperature Monitoring System
   - **Description**: IoT-based temperature monitoring system for embedded systems project
   - **Field 1**: Temperature (°C)
   - **Field 2**: Voltage (V)
   - **Field 3**: Motor RPM
   - **Field 4**: Alert Status (0=Normal, 1=Alert)
   
5. (Optional) Add metadata:
   - Tags: temperature, monitoring, IoT, Particle Photon
   - Location: Your laboratory location

6. Click "Save Channel"

## 3. Get Your API Keys

After creating your channel:

1. Go to the "API Keys" tab
2. Note your "Write API Key" - This will be used in Node-RED to send data
3. Note your "Read API Key" - This will be used for viewing private channels

## 4. Create Visualizations

ThingSpeak allows you to create various visualizations:

### Temperature Gauge

1. Go to your channel page
2. Click "MATLAB Visualizations" → "Add Visualization"
3. Select "Gauge" from the gallery
4. Configure:
   - Channel: Your channel ID
   - Field: 1 (Temperature)
   - Min Value: 15
   - Max Value: 30
   - Threshold for warning: 23
5. Click "Create"

### Temperature Line Chart

1. Go to "MATLAB Visualizations" → "Add Visualization"
2. Select "Line Chart" from the gallery
3. Configure:
   - Channel: Your channel ID
   - Field: 1 (Temperature)
   - Time Span: Last 60 minutes
4. Click "Create"

### RPM Visualization

1. Go to "MATLAB Visualizations" → "Add Visualization"
2. Select "Numeric Display" or "Gauge"
3. Configure for Field 3 (Motor RPM)
4. Click "Create"

## 5. Create MATLAB Analysis for Alerts

ThingSpeak can automatically analyze your data:

1. Go to "MATLAB Analysis" → "New MATLAB Code"
2. Enter the following code:

```matlab
% Read the latest temperature value
data = thingSpeakRead(YOUR_CHANNEL_ID, 'NumPoints', 1, 'Fields', 1, 'ReadKey', 'YOUR_READ_API_KEY');
temperature = data(1);

% Check if temperature exceeds threshold
if temperature > 23
    % Log the alert to a ThingSpeak channel
    thingSpeakWrite(YOUR_ALERT_CHANNEL_ID, 'Fields', 1, 'Values', temperature, 'WriteKey', 'YOUR_ALERT_WRITE_API_KEY');
    
    % Output the result
    fprintf('Alert: Temperature is %.1f°C (above threshold)\n', temperature);
else
    fprintf('Normal: Temperature is %.1f°C\n', temperature);
end
```

3. Schedule this analysis to run every 5 minutes

## 6. Configure React

ThingSpeak React allows you to send notifications:

1. Go to "React" → "New React"
2. Configure:
   - Condition Type: Numeric
   - Test Frequency: On Data Insertion
   - Condition: Field 1 > 23
   - Action: Send an email notification
3. Enter your email address and customize the message
4. Click "Save React"

## 7. Mobile App Access

1. Download the ThingSpeak mobile app
2. Log in with your ThingSpeak credentials
3. Access your channel to view real-time data on the go

## 8. Connecting to Your Dashboard

In your React dashboard, you can embed ThingSpeak visualizations:

1. In ThingSpeak, go to each visualization
2. Click "Share" to get the embed code
3. Use this code in your React application's iframe component to display the visualization

## Troubleshooting

- **No data appearing**: Verify your Write API Key and channel ID
- **Delayed data**: ThingSpeak has a 15-second update limit for free accounts
- **Visualization errors**: Check that your field numbers match your channel configuration 