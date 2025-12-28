#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

/* ===== CONFIG ===== */
const char* ssid = "UNAND";
const char* password = "HardiknasDiAndalas";

const char* serverUrl = "https://anja-unprating-unsettlingly.ngrok-free.dev/api/check-commands";

/* ===== HARDWARE PINS ===== */
#define RELAY_1 25
#define RELAY_2 26
#define BUZZER_PIN 27

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);

  // Pin Setup
  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Default Lock (HIGH = OFF/LOCKED)
  digitalWrite(RELAY_1, HIGH);
  digitalWrite(RELAY_2, HIGH);

  // LCD Setup
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("System Starting");
  lcd.setCursor(0, 1);
  lcd.print("Connecting WiFi");

  // WiFi Connect
  WiFi.begin(ssid, password);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected");
    lcd.clear();
    lcd.print("WiFi Connected");
    beep(1);
  } else {
    Serial.println("\nWiFi Failed");
    lcd.clear();
    lcd.print("WiFi Failed");
  }
  delay(1000);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    
    // Kirim GET request
    int httpCode = http.GET();
    
    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println(payload);
      processResponse(payload);
    } else {
      Serial.printf("HTTP Error: %d\n", httpCode);
      lcd.setCursor(0, 0);
      lcd.print("Server Error    ");
    }
    
    http.end();
  } else {
    Serial.println("WiFi Disconnected. Reconnecting...");
    WiFi.reconnect();
  }
  
  delay(1000);
}

void processResponse(String json) {
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, json);
  
  if (error) {
    Serial.println("JSON parse failed");
    return;
  }
  
  // Ambil data dari JSON response
  String action = doc["action"]; // "OPEN", "CLOSE", "NONE"
  
  if (action != "NONE") {
    beep(2); // Bunyi 2 kali pendek
  }
  
  // Update status Relay berdasarkan "states"
  // Format: { "1": "OPEN", "2": "CLOSED" }
  JsonObject states = doc["states"];
  
  String s1 = states["1"].as<String>();
  String s2 = states["2"].as<String>();
  
  updateLocker(1, s1);
  updateLocker(2, s2);
  
  // Update LCD
  updateLCD(s1, s2);
}

void updateLocker(int id, String status) {
  int pin = (id == 1) ? RELAY_1 : RELAY_2;
  
  // OPEN = Relay LOW (Aktif) -> Solenoid Narik (Buka)
  // CLOSED = Relay HIGH (Mati) -> Solenoid Lepas (Kunci)
  if (status == "OPEN") {
    digitalWrite(pin, LOW);
  } else {
    digitalWrite(pin, HIGH);
  }
}

void updateLCD(String s1, String s2) {
  lcd.setCursor(0, 0);
  String l1 = "L1: " + (s1 == "null" ? "OFF" : s1); // Handle null
  while(l1.length() < 16) l1 += " ";
  lcd.print(l1);
  
  lcd.setCursor(0, 1);
  String l2 = "L2: " + (s2 == "null" ? "OFF" : s2);
  while(l2.length() < 16) l2 += " ";
  lcd.print(l2);
}

void beep(int times) {
  for(int i=0; i<times; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    if (i < times-1) delay(100);
  }
}
