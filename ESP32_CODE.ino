#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

/* ================= CONFIGURATION ================= */
#define RELAY_LOCKER_1 25
#define RELAY_LOCKER_2 26
#define SERIAL2_BAUD 9600

// WiFi Credentials
const char* ssid = "UNAND";
const char* password = "HardiknasDiAndalas";

// Server Endpoints
const char* serverUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/verify-qr";
const char* pollUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/check-commands";

/* ================= GLOBALS ================= */
unsigned long lastPollTime = 0;
const long pollInterval = 2000; // Poll commands every 2 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Initialize UART2 for ESP32-CAM (RX=3, TX=1)
  Serial2.begin(SERIAL2_BAUD, SERIAL_8N1, 13, 12);

  // Initialize Relay Pins
  pinMode(RELAY_LOCKER_1, OUTPUT);
  pinMode(RELAY_LOCKER_2, OUTPUT);

  // Initial state: Locked (Relay High for Standard Active Low Modules)
  digitalWrite(RELAY_LOCKER_1, HIGH);
  digitalWrite(RELAY_LOCKER_2, HIGH);

  connectWiFi();

  Serial.println("\n-------------------------------------------");
  Serial.println("SMART LOCKER SYSTEM READY");
  Serial.println("Waiting for QR Code from ESP32-CAM...");
  Serial.println("-------------------------------------------\n");
}

void loop() {
  // 1. Listen for QR Token from ESP32-CAM via Serial2 (UART)
  if (Serial2.available() > 0) {
    String token = Serial2.readStringUntil('\n');
    token.trim();
    
    if (token.length() > 0) {
      Serial.println("[ESP32-CAM] QR Detected - Token: " + token);
      Serial.println("[System] Sending to Server for Validation...");
      sendTokenToServer(token);
      delay(3000); // Prevention for double scanning
    }
  }

  // 2. Poll Server for Remote Commands (Open/Close from Web Dashboard)
  if (millis() - lastPollTime >= pollInterval) {
    lastPollTime = millis();
    checkCommands();
  }
}

/* ================= WIFI CONNECTION ================= */
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi: " + String(ssid));

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Connection failed! Re-check credentials.");
  }
}

/* ================= SERVER VALIDATION ================= */
void sendTokenToServer(String token) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Error] WiFi disconnected. Cannot validate QR.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Required for ngrok/dynamic SSL

  HTTPClient https;
  if (!https.begin(client, serverUrl)) {
    Serial.println("[Error] Could not initialize HTTPS connection.");
    return;
  }

  https.addHeader("Content-Type", "application/json");

  // Create JSON Request
  StaticJsonDocument<200> reqDoc;
  reqDoc["token"] = token;

  String payload;
  serializeJson(reqDoc, payload);

  int httpCode = https.POST(payload);

  if (httpCode == 200) {
    String response = https.getString();
    Serial.println("[Server] Validation Success: " + response);
    handleServerAction(response);
  } else if (httpCode == 404) {
    Serial.println("[Server] Denied: Invalid or Expired QR Code.");
  } else {
    Serial.println("[Server] Error Event: HTTP " + String(httpCode));
  }

  https.end();
}

/* ================= COMMAND POLLING ================= */
void checkCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  
  HTTPClient https;
  if (https.begin(client, pollUrl)) {
    int httpCode = https.GET();
    
    if (httpCode == 200) {
      String response = https.getString();
      // Only process if it's a real command
      if (response.indexOf("NONE") == -1) { 
        Serial.println("[Web] Command Received: " + response);
        handleServerAction(response);
      }
    }
    https.end();
  }
}

/* ================= ACTION HANDLER ================= */
void handleServerAction(String response) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, response);

  if (error) {
    Serial.println("[Error] JSON Parsing failed: " + String(error.c_str()));
    return;
  }

  String action = doc["action"] | "NONE";
  int lockerId = doc["lockerId"] | 0;

  if (action == "NONE") return;

  int relayPin = -1;
  if (lockerId == 1) relayPin = RELAY_LOCKER_1;
  else if (lockerId == 2) relayPin = RELAY_LOCKER_2;

  if (relayPin != -1) {
    if (action == "OPEN") {
      executeRelay(relayPin, true, lockerId); 
    } else if (action == "CLOSE") {
      executeRelay(relayPin, false, lockerId);
    }
  } else {
    Serial.println("[Error] Invalid Locker ID received from server.");
  }
}

/* ================= RELAY EXECUTION ================= */
void executeRelay(int pin, bool open, int num) {
  if (open) {
    Serial.println("[Relay] UNLOCKING Locker " + String(num));
    digitalWrite(pin, LOW); // Trigger Solenoid
  } else {
    Serial.println("[Relay] LOCKING Locker " + String(num));
    digitalWrite(pin, HIGH); // Release Solenoid
  }
}


