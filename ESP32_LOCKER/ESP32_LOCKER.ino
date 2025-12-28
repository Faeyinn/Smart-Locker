#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ctype.h>
#include <Firebase_ESP_Client.h>

/* ===== RELAY (AKTIF LOW) ===== */
#define RELAY_1 25
#define RELAY_2 26

/* ===== WIFI ===== */
const char* ssid = "UNAND";
const char* password = "HardiknasDiAndalas";

/* ===== FIREBASE (FIRESTORE) ===== */
#define API_KEY "AIzaSyBSB-Cd2WvBbGXD2FMj2RyHVFb96059sBk"
#define FIREBASE_PROJECT_ID "smartlocker-d91c0"

/* ===== API BACKEND ===== */
const char* serverUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/verify-qr";

/* ===== PARAMETER VALIDASI TOKEN ===== */
#define MIN_TOKEN_LENGTH 6

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

String lastProcessedToken = "";
bool signupOK = false;

void setup() {
  Serial.begin(115200);

  // Relay setup
  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  digitalWrite(RELAY_1, HIGH);
  digitalWrite(RELAY_2, HIGH);

  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("[ESP32] Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[ESP32] WiFi Connected");

  // Firebase Setup
  config.api_key = API_KEY;
  
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("[ESP32] Firebase Auth Success");
    signupOK = true;
  } else {
    Serial.printf("[ESP32] Firebase Auth Failed: %s\n", config.signer.signupError.message.c_str());
  }
  
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK) {
    // Baca Document dari Firestore: scanners/cam1
    // Menggunakan path yang terpisah dari 'lockers' agar lebih rapi sesuai struktur DB web
    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, "", "scanners/cam1", "")) {
      
      // Parse Response JSON
      // Struktur respons Firestore:
      // { "name": "...", "fields": { "latest_token": { "stringValue": "TOKEN123" } }, ... }
      
      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc, fbdo.payload());
      
      if (!error) {
        // Field di Firestore: latest_token
        const char* tokenRaw = doc["fields"]["latest_token"]["stringValue"];
        
        if (tokenRaw) {
          String token = String(tokenRaw);
          
          if (token != "" && token != lastProcessedToken) {
             Serial.println("[ESP32] New Token from Firestore: " + token);
             
             if (isValidToken(token)) {
               verifyQR(token);
               lastProcessedToken = token;
             } else {
               Serial.println("[ESP32] Token invalid format");
             }
          }
        }
      } else {
        Serial.print("[ESP32] Parse error: ");
        Serial.println(error.c_str());
      }
      
    } else {
       Serial.print("[ESP32] Get Firestore fail: ");
       Serial.println(fbdo.errorReason());
    }
  }
  
  // Interval 2 detik untuk menghemat kuota Read Firestore (Free Tier: 50k reads/day)
  // 2s = ~43k reads/day (aman)
  delay(2000); 
}

bool isValidToken(String token) {
  if (token.length() < MIN_TOKEN_LENGTH) return false;
  for (int i = 0; i < token.length(); i++) {
    if (isalnum(token[i])) return true;
  }
  return false;
}

void verifyQR(String token) {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // SSL ignored for dev

  HTTPClient https;
  if (!https.begin(client, serverUrl)) {
    Serial.println("[ESP32] HTTPS begin failed");
    return;
  }

  https.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["token"] = token;

  String body;
  serializeJson(doc, body);

  Serial.println("[ESP32] Sending POST request: " + body);

  int httpCode = https.POST(body);

  if (httpCode == 200) {
    String response = https.getString();
    Serial.println("[ESP32] Response: " + response);
    handleResponse(response);
  } else {
    Serial.print("[ESP32] HTTP Error: ");
    Serial.println(httpCode);
    Serial.println(https.getString());
  }

  https.end();
}

void handleResponse(String response) {
  StaticJsonDocument<200> doc;
  if (deserializeJson(doc, response)) {
    Serial.println("[ESP32] JSON parse failed");
    return;
  }

  // Sesuai dengan respons API Next.js: { "action": "OPEN", "lockerId": 1 }
  String action = doc["action"];
  int lockerId = doc["lockerId"];

  Serial.println("[ESP32] Action: " + action + " | Locker ID: " + String(lockerId));

  if (action == "OPEN") {
    if (lockerId == 1) openLocker(RELAY_1);
    else if (lockerId == 2) openLocker(RELAY_2);
  }
}

void openLocker(int pin) {
  Serial.println("[ESP32] OPEN LOCKER on pin " + String(pin));
  digitalWrite(pin, LOW);
  delay(5000);
  digitalWrite(pin, HIGH);
  Serial.println("[ESP32] Locker closed");
}
