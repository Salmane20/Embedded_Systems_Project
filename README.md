# IoT-Based Temperature Monitoring System

## Team Members
- Salmane El Mansour Billah
- Rania Terrab
- Ziyad Boudhim

## Project Description
This project implements an automated temperature monitoring system for industrial, agricultural, and healthcare environments. Using a TMP36 sensor connected to a Photon 20 microcontroller, the system collects real-time temperature data and transmits it to the cloud. A responsive web dashboard provides administrators with visualization tools, alerts, and remote control capabilities. The system features both remote monitoring via the web interface and local feedback through LED indicators and LCD display.

## Features
- Real-time temperature monitoring with configurable sampling rates
- Remote dashboard visualization with historical data trends
- Temperature threshold alerts with customizable parameters
- Device status updates (online/offline, battery level, connectivity)
- Manual controls (reset alerts, refresh data, toggle °C/°F)
- Comprehensive notifications log with alert history
- Power management with battery backup for continuous operation
- Automatic anomaly detection for temperature fluctuations

## Technologies Used
- Photon 20 Microcontroller
- TMP36 Temperature Sensor
- Particle Cloud / ThingSpeak for data transmission
- React.js and TypeScript for web dashboard
- Tailwind CSS for responsive UI design
- LED indicators and LCD display for local feedback
- LiPo battery for backup power supply

## Hardware Setup Instructions
1. Connect the TMP36 sensor to analog pin A0 on the Photon 20
2. Connect the status LEDs to pins D3 (warning) and D4 (critical)
3. Wire the LCD display to I2C pins (D0, D1)
4. Install the LiPo battery to the designated connector
5. Secure all components in the project enclosure
6. Power on the system via USB or external power supply

## Software Setup Instructions
1. Create an account on Particle Cloud or ThingSpeak
2. Flash the firmware to the Photon 20 using Particle Web IDE:
   - Upload the TempSense.ino file
   - Insert your authentication tokens
   - Deploy the firmware
3. Configure the web dashboard:
   - Clone the repository
   - Run `npm install` to install dependencies
   - Update API keys in `.env` file
   - Run `npm run build` to create production build
   - Deploy the dashboard to your hosting service

## How to Use
1. Power on the system and confirm the green status LED illuminates
2. Access the web dashboard at your deployment URL
3. View current temperature in the "Live Temperature" panel
4. Review historical data in the "Temperature Chart" section
5. Set custom thresholds in the "Threshold Settings" panel
6. Monitor device status and connection health
7. Receive notifications when temperature exceeds thresholds
8. Toggle between Celsius and Fahrenheit as needed
9. Reset alerts or refresh data using the control panel

## Screenshots
![Dashboard Overview](dashboard.png)
*Web dashboard showing temperature monitoring interface*

![Hardware Setup](hardware.png)
*Hardware implementation with Photon 20, TMP36 sensor, and indicator LEDs*

## License
This project is available for academic use only. All rights reserved © 2025 Salmane El Mansour Billah, Rania Terrab, Ziyad Boudhim.

## Acknowledgements
We would like to thank our course instructor for guidance throughout this project. Special thanks to Particle.io for their robust IoT platform and documentation. This project was inspired by real-world applications of IoT technology in critical temperature monitoring environments.