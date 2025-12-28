#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define RELAY_1 25
#define RELAY_2 26

const char* ssid = "UNAND";
const char* password = "HardiknasDiAndalas";
const char* serverUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/verify-qr";

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);

  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  digitalWrite(RELAY_1, HIGH);
  digitalWrite(RELAY_2, HIGH);

  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
}

void loop() {
  if (Serial2.available()) {
    String token = Serial2.readStringUntil('\n');
    token.trim();

    Serial.println("Token Received: " + token);
    verifyQR(token);
  }
}

void verifyQR(String token) {
  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient https;
  if (!https.begin(client, serverUrl)) return;

  https.addHeader("Content-Type", "application/json");

  StaticJsonDocument<200> doc;
  doc["token"] = token;

  String body;
  serializeJson(doc, body);

  int code = https.POST(body);

  if (code == 200) {
    String response = https.getString();
    handleResponse(response);
  }

  https.end();
}

void handleResponse(String response) {
  StaticJsonDocument<200> doc;
  if (deserializeJson(doc, response)) return;

  String action = doc["action"];
  int lockerId = doc["lockerId"];

  if (action == "OPEN") {
    if (lockerId == 1) openLocker(RELAY_1);
    if (lockerId == 2) openLocker(RELAY_2);
  }
}

void openLocker(int pin) {
  Serial.println("OPEN LOCKER");
  digitalWrite(pin, LOW);
  delay(5000);
  digitalWrite(pin, HIGH);
}
