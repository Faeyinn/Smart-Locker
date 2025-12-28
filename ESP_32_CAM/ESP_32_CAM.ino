#include "ESP32QRCodeReader.h"
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

#define WIFI_SSID "UNAND"
#define WIFI_PASSWORD "HardiknasDiAndalas"

#define API_KEY "AIzaSyBSB-Cd2WvBbGXD2FMj2RyHVFb96059sBk"
#define FIREBASE_PROJECT_ID "smartlocker-d91c0"

ESP32QRCodeReader qrReader(CAMERA_MODEL_AI_THINKER);

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

String lastToken = "";
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  delay(2000);

  // 1. Setup WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // 2. Setup Firebase
  config.api_key = API_KEY;
  
  // Sign up anonymous
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase Auth Success");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }
  
  // Token generation implementation handling
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // 3. Init QR Reader
  Serial.println("Init QR Reader...");
  qrReader.setup();
  qrReader.begin();

  Serial.println("ESP32-CAM READY (Firestore Mode)");
}

void loop() {
  struct QRCodeData qrData;

  // Cek QR Code
  if (qrReader.receiveQrCode(&qrData, 100)) {
    if (qrData.valid) {
      String token = String((char*)qrData.payload);

      if (token != lastToken) {
        lastToken = token;
        
        Serial.print("[ESP32-CAM] QR Detected: ");
        Serial.println(token);

        if (Firebase.ready() && signupOK) {
          // Siapkan data JSON untuk Firestore
          // Struktur: fields -> latest_token -> stringValue: "token_nya"
          FirebaseJson content;
          content.set("fields/latest_token/stringValue", token);
          
          // Nama dokumen: scanners/cam1
          // Menggunakan patchDocument agar tidak menimpa field lain jika ada
          String documentPath = "scanners/cam1"; 
          
          Serial.print("Updating Firestore... ");
          
          if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, "" /* databaseId */, documentPath.c_str(), content.raw(), "latest_token")) {
             Serial.println("PASSED");
          } else {
             Serial.println("FAILED");
             Serial.println(fbdo.errorReason());
          }
        }
      }
    }
  }
}
