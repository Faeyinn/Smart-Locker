#include "esp_camera.h"
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "ESP32QRCodeReader.h"

/* ================= WIFI ================= */
const char* ssid = "NAMA_WIFI";
const char* password = "PASSWORD_WIFI";

/* ============ API ENDPOINT URL ========= */
// Ganti dengan URL Next.js app Anda
// Untuk production: https://your-domain.com/api/verify-qr
// Untuk local testing (ngrok): https://your-ngrok-url.ngrok.io/api/verify-qr
const char* serverUrl = "https://YOUR_DOMAIN.com/api/verify-qr";

/* ================= GPIO ================= */
#define RELAY_LOCKER_1 12
#define RELAY_LOCKER_2 13

/* ============ QR READER ================= */
ESP32QRCodeReader qrReader(CAMERA_MODEL_AI_THINKER);

/* ======================================== */
void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(RELAY_LOCKER_1, OUTPUT);
  pinMode(RELAY_LOCKER_2, OUTPUT);

  // Initialize relays to CLOSED state (HIGH)
  // Adjust based on your relay module type (HIGH/LOW trigger)
  digitalWrite(RELAY_LOCKER_1, HIGH);
  digitalWrite(RELAY_LOCKER_2, HIGH);

  connectWiFi();
  startCamera();
  qrReader.setup();
  qrReader.begin();

  Serial.println("ESP32-CAM READY - Scan QR Code...");
}

/* ======================================== */
void loop() {
  struct QRCodeData qrData;

  if (qrReader.receiveQrCode(&qrData, 100)) {
    if (qrData.valid) {
      String token = String((char*)qrData.payload);
      Serial.println("QR Code Detected: " + token);

      sendTokenToServer(token);
      delay(3000); // Anti double scan - wait 3 seconds
    }
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

/* ============= CAMERA =================== */
void startCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0       = 5;
  config.pin_d1       = 18;
  config.pin_d2       = 19;
  config.pin_d3       = 21;
  config.pin_d4       = 36;
  config.pin_d5       = 39;
  config.pin_d6       = 34;
  config.pin_d7       = 35;
  config.pin_xclk     = 0;
  config.pin_pclk     = 22;
  config.pin_vsync    = 25;
  config.pin_href     = 23;
  config.pin_sccb_sda = 26;
  config.pin_sccb_scl = 27;
  config.pin_pwdn     = 32;
  config.pin_reset    = -1;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_GRAYSCALE;
  config.frame_size   = FRAMESIZE_QVGA;
  config.jpeg_quality = 12;
  config.fb_count     = 1;

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  Serial.println("Camera initialized successfully");
}

/* ========= SEND TOKEN TO SERVER ========= */
void sendTokenToServer(String token) {
  WiFiClientSecure client;
  client.setInsecure(); // Skip certificate validation (use with caution in production)

  HTTPClient https;
  
  Serial.println("Connecting to server...");
  if (!https.begin(client, serverUrl)) {
    Serial.println("Connection failed!");
    return;
  }

  https.addHeader("Content-Type", "application/json");

  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["token"] = token;

  String payload;
  serializeJson(doc, payload);
  Serial.println("Sending: " + payload);

  int httpCode = https.POST(payload);

  if (httpCode == 200) {
    String response = https.getString();
    Serial.println("Response: " + response);
    handleResponse(response);
  } else if (httpCode == 404) {
    Serial.println("Error: Invalid or expired QR code");
    // Optional: Add LED blink or buzzer here
  } else {
    Serial.println("Error: HTTP " + String(httpCode));
    String errorResponse = https.getString();
    Serial.println("Response: " + errorResponse);
  }

  https.end();
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

  String action = doc["action"] | "";
  int lockerId = doc["lockerId"] | 0;

  if (action == "OPEN" && lockerId > 0) {
    Serial.println("Opening Locker " + String(lockerId));
    
    if (lockerId == 1) {
      openLocker(RELAY_LOCKER_1);
    } else if (lockerId == 2) {
      openLocker(RELAY_LOCKER_2);
    } else {
      Serial.println("Invalid locker ID: " + String(lockerId));
    }
  } else {
    Serial.println("Invalid response format");
  }
}

/* ============ OPEN LOCKER =============== */
void openLocker(int relayPin) {
  Serial.println("Opening locker on pin " + String(relayPin) + "...");
  
  // Activate relay (LOW = relay ON for most modules)
  // If your relay is HIGH trigger, change LOW to HIGH
  digitalWrite(relayPin, LOW);
  
  delay(5000); // Locker open for 5 seconds
  
  // Deactivate relay (HIGH = relay OFF)
  digitalWrite(relayPin, HIGH);
  
  Serial.println("Locker closed");
}

