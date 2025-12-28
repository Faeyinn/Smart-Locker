#include "esp_camera.h"
#include "ESP32QRCodeReader.h"

/* ===== CAMERA MODEL ===== */
#define CAMERA_MODEL_AI_THINKER

/* ===== UART ===== */
#define TXD 12
#define RXD 13

ESP32QRCodeReader qrReader;

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
  config.pin_sscb_sda = 26;
  config.pin_sscb_scl = 27;
  config.pin_pwdn     = 32;
  config.pin_reset    = -1;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_GRAYSCALE;
  config.frame_size   = FRAMESIZE_QVGA;
  config.jpeg_quality = 12;
  config.fb_count     = 1;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("Camera init failed");
    while (true);
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("--- MEMULAI SISTEM ---");
  
  Serial2.begin(9600, SERIAL_8N1, RXD, TXD); 
  qrReader.setup();
  qrReader.begin();
  Serial.println("ESP32-CAM READY");
}

void loop() {
  struct QRCodeData qrData;
  if (qrReader.receiveQrCode(&qrData, 100)) {
    if (qrData.valid) {
      String token = String((char*)qrData.payload);
      Serial.println("QR Terdeteksi: " + token);
      Serial2.println(token);
      delay(3000); 
    }
  }
}
