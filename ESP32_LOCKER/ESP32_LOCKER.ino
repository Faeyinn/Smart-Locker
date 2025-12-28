#include <WiFi.h>
#include <WiFiClientSecure.h>
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

// Initialize 20x4 LCD
LiquidCrystal_I2C lcd(0x27, 20, 4);

String lastUsage1 = "";
String lastUsage2 = "";

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
    Serial.println("\nWiFi Connected :)");
    lcd.clear();
    lcd.print("WiFi Connected :)");
    beep(1);
  } else {
    Serial.println("\nWiFi Failed :(");
    lcd.clear();
    lcd.print("WiFi Failed :(");
  }
  delay(1000);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Ignore SSL certificate errors for Ngrok/Dev

    HTTPClient http;
    http.begin(client, serverUrl);
    
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
    beep(2);
  }

  JsonObject states = doc["states"];
  
  // Locker 1 Data
  JsonObject s1_obj = states["1"];
  String l1_lock = s1_obj["lock"].as<String>();
  String l1_usage = s1_obj["usage"].as<String>();

  // Locker 2 Data
  JsonObject s2_obj = states["2"];
  String l2_lock = s2_obj["lock"].as<String>();
  String l2_usage = s2_obj["usage"].as<String>();
  
  // Deteksi perubahan status usage
  bool statusChanged = false;
  
  // Cek Locker 1
  if (lastUsage1 != "" && l1_usage != lastUsage1) {
    statusChanged = true;
  }
  // Cek Locker 2
  if (lastUsage2 != "" && l2_usage != lastUsage2) {
    statusChanged = true;
  }
  
  if (statusChanged) {
    beep(1);
  }
  
  // Update state terakhir
  lastUsage1 = l1_usage;
  lastUsage2 = l2_usage;
  
  // Update Relays (Logic by "lock" status)
  updateLocker(1, l1_lock);
  updateLocker(2, l2_lock);
  
  // Update LCD 4 Lines
  updateLCD4(l1_usage, l1_lock, l2_usage, l2_lock);
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

void updateLCD4(String u1, String s1, String u2, String s2) {
  printLine(0, "L1: " + u1);
  printLine(1, "   Status: " + s1);
  printLine(2, "L2: " + u2);
  printLine(3, "   Status: " + s2);
}

void printLine(int row, String text) {
  lcd.setCursor(0, row);
  // Padding with spaces to clear old characters
  while(text.length() < 20) text += " ";
  lcd.print(text);
}

void beep(int times) {
  for(int i=0; i<times; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
    if (i < times-1) delay(100);
  }
}
