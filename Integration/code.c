#include "Particle.h"
#include "HttpClient.h" // Include HTTP client library for ThingSpeak

// ThingSpeak settings
const char* THINGSPEAK_SERVER = "api.thingspeak.com";
const String THINGSPEAK_API_KEY = "UU67E4LHWZTK10H4"; 
unsigned long lastThingSpeakUpdate = 0;
const unsigned long THINGSPEAK_INTERVAL = 15000; // ThingSpeak free tier has 15s update limit

// Define pins
const int TEMP_SENSOR_PIN = A0;        // Analog pin for temperature sensor
const int POTENTIOMETER_PIN = A1;      // Analog pin for potentiometer
const int LED_PIN = D2;                // Digital pin for LED
const int MOTOR_PIN = D3;              // PWM pin for motor control
const int BUTTON_PIN = D4;             // Digital pin for button

// Threshold values
const float TEMP_THRESHOLD = 23.0;     // Temperature threshold in Celsius
const float VOLTAGE_THRESHOLD = 3.0;   // Voltage threshold in volts (adjust based on your setup)

// Variables
float currentTemp = 0.0;
float currentVoltage = 0.0;
bool tempAlertActive = false;
bool voltageAlertActive = false;
int motorRPM = 0;                      // Stores current motor RPM (0-255 for PWM)

// Create HTTP client
HttpClient http;
http_header_t headers[] = {
    { "Content-Type", "application/x-www-form-urlencoded" },
    { NULL, NULL }
};

http_request_t request;
http_response_t response;

void setup() {
    // Initialize pins
    pinMode(TEMP_SENSOR_PIN, INPUT);
    pinMode(POTENTIOMETER_PIN, INPUT);
    pinMode(LED_PIN, OUTPUT);
    pinMode(MOTOR_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP); // Button with internal pull-up resistor
    
    // Initialize serial communication
    Serial.begin(9600);
    
    // Register Particle functions and variables
    Particle.function("setRPM", setMotorRPM);
    Particle.variable("temperature", currentTemp);
    Particle.variable("voltage", currentVoltage);
    Particle.variable("rpm", motorRPM);
    
    // Initialize motor and LED
    analogWrite(MOTOR_PIN, 0);
    digitalWrite(LED_PIN, LOW);
    
    // Setup ThingSpeak HTTP request
    request.hostname = THINGSPEAK_SERVER;
    request.port = 80;
    request.path = "/update";
}

void loop() {
    // Read sensors
    readTemperature();
    readVoltage();
    
    // Check temperature threshold
    if (currentTemp > TEMP_THRESHOLD && !tempAlertActive) {
        tempAlertActive = true;
        Particle.publish("temp_alert", String::format("High temperature: %.1f°C", currentTemp), PRIVATE);
    } else if (currentTemp <= TEMP_THRESHOLD) {
        tempAlertActive = false;
        digitalWrite(LED_PIN, LOW); // Turn off LED if temperature drops below threshold
    }
    
    // Check voltage threshold
    if (currentVoltage > VOLTAGE_THRESHOLD && !voltageAlertActive) {
        voltageAlertActive = true;
        Particle.publish("voltage_alert", String::format("High voltage: %.2fV", currentVoltage), PRIVATE);
    } else if (currentVoltage <= VOLTAGE_THRESHOLD) {
        voltageAlertActive = false;
    }
    
    // Check button press (only works when temperature is above threshold)
    if (tempAlertActive && digitalRead(BUTTON_PIN) == LOW) {
        digitalWrite(LED_PIN, HIGH);
        delay(200); // Simple debounce
    }
    
    // Send data to ThingSpeak (respecting the rate limit)
    if (millis() - lastThingSpeakUpdate > THINGSPEAK_INTERVAL) {
        sendToThingSpeak();
        lastThingSpeakUpdate = millis();
    }
    
    // Small delay to prevent flooding
    delay(1000);
}

void readTemperature() {
    // Read analog value and convert to temperature (example for TMP36 sensor)
    int reading = analogRead(TEMP_SENSOR_PIN);
    float voltage = reading * 3.3 / 4095.0; // Convert to voltage (Photon has 12-bit ADC)
    currentTemp = (voltage - 0.5) * 100.0;   // Convert to Celsius for TMP36
    
    // For other sensors, adjust the conversion formula accordingly
}

void readVoltage() {
    // Read potentiometer value and convert to voltage
    int reading = analogRead(POTENTIOMETER_PIN);
    currentVoltage = reading * 3.3 / 4095.0; // Convert to voltage (0-3.3V range)
    
    // If you're measuring higher voltages with a voltage divider, adjust the scaling factor
}

// Cloud function to set motor RPM
int setMotorRPM(String command) {
    // Only allow RPM change if voltage alert is active
    if (!voltageAlertActive) {
        return -1; // Error code - voltage not in alert state
    }
    
    // Convert string to integer
    int newRPM = command.toInt();
    
    // Validate input (PWM range 0-255)
    if (newRPM >= 0 && newRPM <= 255) {
        motorRPM = newRPM;
        analogWrite(MOTOR_PIN, motorRPM);
        return 1; // Success
    }
    
    return -2; // Error code - invalid RPM value
}

// Send data to ThingSpeak
void sendToThingSpeak() {
    // Create the data string with API key and field values
    String data = "api_key=" + THINGSPEAK_API_KEY;
    data += "&field1=" + String(currentTemp);
    data += "&field2=" + String(currentVoltage);
    data += "&field3=" + String(motorRPM);
    data += "&field4=" + String((tempAlertActive || voltageAlertActive) ? 1 : 0);
    
    // Set request body and method
    request.body = data;
    request.method = http_method_t::POST;
    
    // Send the request to ThingSpeak
    http.request(request, response, headers);
    
    // Log to serial for debugging
    Serial.print("ThingSpeak Update Status: ");
    Serial.print(response.status);
    Serial.print(", Response: ");
    Serial.println(response.body);
} 