# Node-RED and ThingSpeak Integration Guide

This guide explains how to integrate our Particle Photon temperature monitoring system with Node-RED and ThingSpeak to create a complete IoT solution.

## Node-RED Integration

[Node-RED](https://nodered.org/) is a flow-based programming tool that makes it easy to wire together IoT devices, APIs, and online services.

### Setting Up Node-RED

1. **Install Node-RED**
   ```bash
   npm install -g --unsafe-perm node-red
   ```

2. **Start Node-RED**
   ```bash
   node-red
   ```

3. **Access the Node-RED editor** at http://localhost:1880

### Creating a Flow for Particle Photon

Our Node-RED flow will:
1. Subscribe to Particle events
2. Process the temperature and voltage data
3. Send alerts for high temperature or voltage
4. Forward data to ThingSpeak for visualization and storage

#### Required Nodes

- **Particle**: Install the `node-red-contrib-particle` package to integrate with Particle Cloud
- **ThingSpeak**: Install the `node-red-contrib-thingspeak42` package for ThingSpeak integration

#### Sample Flow

Import the `NodeRED_Flow.json` file into your Node-RED instance to get started. The flow includes:

- Particle event nodes that subscribe to "temp_alert" and "voltage_alert" events
- Function nodes to format data for ThingSpeak
- ThingSpeak nodes to send data to your ThingSpeak channel
- Dashboard nodes to visualize real-time data
- Alert nodes to send notifications via email or SMS

## ThingSpeak Integration

[ThingSpeak](https://thingspeak.com/) is an IoT analytics platform that allows you to collect, visualize, and analyze live data streams in the cloud.

### Setting Up ThingSpeak

1. **Create a ThingSpeak account** at https://thingspeak.com/
2. **Create a new channel** with the following fields:
   - Field 1: Temperature (°C)
   - Field 2: Voltage (V)
   - Field 3: Motor RPM
   - Field 4: Alert Status (0 or 1)

3. **Note your API keys**:
   - Write API Key: Used to send data to ThingSpeak
   - Read API Key: Used to read data from ThingSpeak

### Visualizing Data

ThingSpeak provides several visualization tools:
- Line charts for temperature trends
- Gauge visualizations for current values
- MATLAB analysis for advanced data processing

### Setting Up Alerts

1. Configure MATLAB Analysis in ThingSpeak to detect threshold violations
2. Use ThingSpeak's React feature to send notifications when conditions are met

## Complete Integration Architecture

```
+----------------+       +------------+       +---------------+
| Particle Photon| ----> | Node-RED   | ----> | ThingSpeak    |
| (Temperature   |       | (Processing|       | (Visualization|
|  Monitoring)   |       |  & Routing)|       |  & Storage)   |
+----------------+       +------------+       +---------------+
         |                     |                     |
         v                     v                     v
   Local Control         SMS/Email             Web Dashboard
                          Alerts
```

## Testing the Integration

1. Power on your Particle Photon device with the provided `code.c`
2. Start your Node-RED instance with the imported flow
3. Monitor the ThingSpeak channel for incoming data
4. Test alerts by increasing temperature above the threshold (23°C)

## Troubleshooting

- Verify Particle device ID and access token in Node-RED
- Check ThingSpeak API keys
- Ensure all Node-RED nodes are properly configured
- Monitor Particle console for device connectivity issues 