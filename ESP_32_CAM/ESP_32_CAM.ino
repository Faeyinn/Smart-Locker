#include "ESP32QRCodeReader.h"

// UART ke ESP32 utama
#define CAM_TX 14
#define CAM_RX 15

ESP32QRCodeReader qrReader(CAMERA_MODEL_AI_THINKER);
HardwareSerial camSerial(1);

void setup() {
  Serial.begin(115200);
  delay(2000);

  camSerial.begin(9600, SERIAL_8N1, CAM_RX, CAM_TX);

  Serial.println("Init QR Reader...");
  qrReader.setup();
  qrReader.begin();

  Serial.println("ESP32-CAM READY");
}

void loop() {
  struct QRCodeData qrData;

  if (qrReader.receiveQrCode(&qrData, 100)) {
    if (qrData.valid) {
      String token = String((char*)qrData.payload);
      Serial.println("QR Detected: " + token);

      camSerial.println(token);
      delay(2000);
    }
  }
}
