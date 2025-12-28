# ESP32 Smart Locker Integration Guide

## Overview
This guide explains how to integrate your ESP32-CAM with the SmartLocker Next.js backend.

## Prerequisites
- ESP32-CAM with camera module
- WiFi credentials
- Next.js application deployed (or running locally with ngrok for testing)

## Configuration

### 1. Update ESP32 Code

Edit the following constants in your ESP32 code:

```cpp
/* ================= WIFI ================= */
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

/* ============ API ENDPOINT URL ========= */
// For production (deployed Next.js app):
// const char* serverUrl = "https://iotsmartlocker.vercel.app/api/verify-qr";

// For local testing (using ngrok):
const char* serverUrl = "https://your-ngrok-url.ngrok.io/api/verify-qr";
```

### 2. Relay Pin Configuration

The code uses:
- `RELAY_LOCKER_1` (GPIO 12) for Locker 1
- `RELAY_LOCKER_2` (GPIO 13) for Locker 2

Make sure your relay module is connected correctly. The code uses **LOW** to open (activate relay) and **HIGH** to close.

### 3. API Endpoint

The backend provides an endpoint at `/api/verify-qr` that:

**Request:**
```json
POST /api/verify-qr
Content-Type: application/json

{
  "token": "booking-id-from-qr-code"
}
```

**Response (Success):**
```json
{
  "action": "OPEN",
  "lockerId": 1  // or 2, based on locker number
}
```

**Response (Error):**
```json
{
  "error": "Invalid or expired token"
}
```

### 4. How It Works

1. User books a locker through the web app
2. User receives a QR code with booking ID
3. ESP32-CAM scans the QR code
4. ESP32 sends the token (booking ID) to `/api/verify-qr`
5. Backend verifies the token:
   - Checks if booking exists and is active
   - Gets locker information
   - Marks booking as completed
   - Updates locker status to available
6. Backend returns `{ action: "OPEN", lockerId: <number> }`
7. ESP32 opens the corresponding locker for 5 seconds
8. Locker automatically closes

## Local Testing with ngrok

For testing with local Next.js server:

1. Install ngrok: https://ngrok.com/
2. Start your Next.js dev server: `npm run dev`
3. Run ngrok: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update ESP32 code:
   ```cpp
   const char* serverUrl = "https://abc123.ngrok.io/api/verify-qr";
   ```

## Important Notes

1. **Security**: The current implementation uses `client.setInsecure()` for HTTPS. For production, consider adding proper SSL certificate validation.

2. **Locker Numbering**: The `lockerId` in the response corresponds to the `number` field in the locker document, not the document ID.

3. **Token Format**: The QR code contains the booking ID (Firestore document ID), which is a unique identifier.

4. **Anti-Double Scan**: The code includes a 3-second delay after scanning to prevent double scans.

5. **Relay Logic**: 
   - `digitalWrite(relayPin, LOW)` = Relay ON = Locker OPEN
   - `digitalWrite(relayPin, HIGH)` = Relay OFF = Locker CLOSED
   - Adjust based on your relay module type (HIGH trigger vs LOW trigger)

## Troubleshooting

### ESP32 can't connect to WiFi
- Check SSID and password
- Ensure 2.4GHz WiFi (ESP32 doesn't support 5GHz)

### HTTP requests failing
- Verify server URL is correct
- Check if server is accessible from ESP32 network
- For local testing, ensure ngrok is running

### QR code not recognized
- Ensure camera is focused
- Check lighting conditions
- Verify QR code is displayed clearly on screen

### Locker not opening
- Check relay connections
- Verify GPIO pins are correct
- Test relay separately with simple HIGH/LOW commands

## API Error Handling

The ESP32 code currently logs errors to Serial. To improve error handling, you can modify `sendTokenToServer()`:

```cpp
void sendTokenToServer(String token) {
  // ... existing code ...
  
  if (httpCode == 200) {
    String response = https.getString();
    handleResponse(response);
  } else if (httpCode == 404) {
    Serial.println("Invalid QR Code");
    // Optional: Add LED blink or buzzer
  } else {
    Serial.println("Server Error: " + String(httpCode));
  }
  
  // ... rest of code ...
}
```

## Next Steps

1. Deploy your Next.js app to production (Vercel, Netlify, etc.)
2. Update ESP32 with production URL
3. Test end-to-end flow
4. Consider adding:
   - SSL certificate validation
   - Better error handling
   - Status LED indicators
   - Buzzer for feedback
   - Admin override functionality

