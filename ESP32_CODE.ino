#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

/* ================= WIFI ================= */
#define RELAY_LOCKER_1 25
#define RELAY_LOCKER_2 26
#define SERIAL2_BAUD 9600

const char* ssid = "UNAND";
const char* password = "HardiknasDiAndalas";

const char* serverUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/verify-qr";
const char* pollUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/check-commands";
unsigned long lastPollTime = 0;
const long pollInterval = 2000; // Poll every 2 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial2.begin(SERIAL2_BAUD, SERIAL_8N1, 16, 17);

  pinMode(RELAY_LOCKER_1, OUTPUT);
  pinMode(RELAY_LOCKER_2, OUTPUT);

  // Initialize relays ke state NC (Normally Closed) - HIGH = solenoid mendapat 12V
  // Relay aktif LOW, jadi HIGH = relay OFF = solenoid ON (NC) - Wait, logic below says LOW=Open.
  // Assuming LOW = Active = Open (Solenoid Retract)
  digitalWrite(RELAY_LOCKER_1, HIGH);
  digitalWrite(RELAY_LOCKER_2, HIGH);

  connectWiFi();

  Serial.println("ESP32 READY - Waiting for QR code or Web Commands...");
}

void loop() {
  // 1. Baca data QR code dari ESP32-CAM via Serial2
  if (Serial2.available() > 0) {
    String token = Serial2.readStringUntil('\n');
    token.trim(); // Hapus whitespace
    
    if (token.length() > 0) {
      Serial.println("QR Code Received from ESP32-CAM: " + token);
      sendTokenToServer(token);
      delay(3000); // Anti double scan
    }
  }

  // 2. Poll Server for Web Commands
  if (millis() - lastPollTime >= pollInterval) {
    lastPollTime = millis();
    checkCommands();
  }
}

/* ============== WIFI ==================== */
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed!");
    Serial.println("Please check your credentials and try again.");
  }
}

/* ========= SEND TOKEN TO SERVER ========= */
void sendTokenToServer(String token) {
  WiFiClientSecure client;
  client.setInsecure(); // Skip certificate validation

  HTTPClient https;
  
  if (!https.begin(client, serverUrl)) {
    Serial.println("Connection failed!");
    return;
  }

  https.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["token"] = token;

  String payload;
  serializeJson(doc, payload);
  Serial.println("Sending QR: " + payload);

  int httpCode = https.POST(payload);

  if (httpCode == 200) {
    String response = https.getString();
    Serial.println("Response: " + response);
    handleResponse(response);
  } else {
    Serial.println("Error: HTTP " + String(httpCode));
  }

  https.end();
}

/* ========= CHECK COMMANDS ============= */
void checkCommands() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure();
  
  HTTPClient https;
  
  if (https.begin(client, pollUrl)) {
    int httpCode = https.GET();
    
    if (httpCode == 200) {
      String response = https.getString();
      // Only print if action is not NONE to avoid spamming serial
      if (response.indexOf("NONE") == -1) { 
        Serial.println("Poll Response: " + response);
        handleResponse(response);
      }
    }
    https.end();
  }
}

/* ========== HANDLE RESPONSE ============= */
void handleResponse(String response) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, response);

  if (error) {
    Serial.print("JSON parsing failed: ");
    Serial.println(error.c_str());
    return;
  }

  String action = doc["action"] | "NONE";
  int lockerId = doc["lockerId"] | 0;

  if (action == "NONE") return;

  Serial.println("Action: " + action + " for Locker " + String(lockerId));

  int relayPin = -1;
  if (lockerId == 1) relayPin = RELAY_LOCKER_1;
  else if (lockerId == 2) relayPin = RELAY_LOCKER_2;

  if (relayPin != -1) {
    if (action == "OPEN") {
      controlRelay(relayPin, true); // OPEN
    } else if (action == "CLOSE") {
      controlRelay(relayPin, false); // CLOSE
    }
  } else {
    Serial.println("Invalid locker ID");
  }
}

/* ============ CONTROL RELAY ============= */
void controlRelay(int relayPin, bool open) {
  if (open) {
    Serial.println("Opening Relay...");
    digitalWrite(relayPin, LOW); // Active LOW -> ON -> Open
  } else {
    Serial.println("Closing Relay...");
    digitalWrite(relayPin, HIGH); // OFF -> Close
  }
  // Note: If using Solenoid, ensure it doesn't overheat if kept OPEN (LOW) for too long.
}

