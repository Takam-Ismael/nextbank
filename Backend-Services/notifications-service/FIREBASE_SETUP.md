# Firebase Cloud Messaging (FCM) Setup Guide

This guide explains how to set up Firebase Cloud Messaging for push notifications in NextBank.

## Overview

The Notifications Service now supports **real push notifications** via Firebase Cloud Messaging (FCM). When a notification is created (e.g., card issued, transfer received), it:

1. **Saves to database** (for notification history)
2. **Sends push notification** to all user's registered devices (Android/iOS)

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `NextBank` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Android App (for React Native)

1. In Firebase Console, click "Add app" → Android icon
2. **Android package name**: `com.nextbank.mobile` (must match your React Native app)
3. **App nickname**: NextBank Mobile
4. Download `google-services.json`
5. Place it in your React Native project: `android/app/google-services.json`

### Step 3: Add iOS App (for React Native)

1. In Firebase Console, click "Add app" → iOS icon
2. **iOS bundle ID**: `com.nextbank.mobile` (must match your React Native app)
3. **App nickname**: NextBank Mobile
4. Download `GoogleService-Info.plist`
5. Place it in your React Native project: `ios/GoogleService-Info.plist`

### Step 4: Generate Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file (e.g., `nextbank-firebase-adminsdk-xxxxx.json`)
5. **Keep this file secure!** It contains admin credentials

## Backend Configuration

### Option 1: File Path (Development)

1. Place the service account JSON file in `src/main/resources/`:
   ```
   src/main/resources/firebase-service-account.json
   ```

2. Update `application.yml`:
   ```yaml
   firebase:
     enabled: true
     service-account-key-path: classpath:firebase-service-account.json
   ```

### Option 2: Base64 Environment Variable (Production)

1. Convert service account JSON to base64:
   ```bash
   # Linux/Mac
   base64 -w 0 firebase-service-account.json
   
   # Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json"))
   ```

2. Set environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY_BASE64="<base64-string>"
   ```

3. Update `application.yml`:
   ```yaml
   firebase:
     enabled: true
     service-account-key-base64: ${FIREBASE_SERVICE_ACCOUNT_KEY_BASE64}
   ```

### Option 3: Disable Firebase (Testing)

If you want to test without Firebase:

```yaml
firebase:
  enabled: false
```

Notifications will still be saved to database but no push notifications will be sent.

## Mobile App Integration

### React Native Setup

1. Install Firebase packages:
   ```bash
   npm install @react-native-firebase/app @react-native-firebase/messaging
   ```

2. Configure Android (`android/build.gradle`):
   ```gradle
   buildscript {
     dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   ```

3. Apply plugin (`android/app/build.gradle`):
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

4. Configure iOS (run):
   ```bash
   cd ios && pod install
   ```

### Get FCM Token in React Native

```javascript
import messaging from '@react-native-firebase/messaging';

// Request permission (iOS)
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// Get FCM token
async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

// Register token with backend
async function registerDeviceToken(token, jwtToken) {
  await fetch('http://localhost:8084/api/notifications/device-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({
      deviceToken: token,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
    })
  });
}

// Handle foreground messages
messaging().onMessage(async remoteMessage => {
  console.log('Foreground notification:', remoteMessage);
  // Show in-app notification
});

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background notification:', remoteMessage);
});
```

### Complete Flow

1. **User logs in** → App gets FCM token
2. **App registers token** → `POST /api/notifications/device-token`
3. **Backend creates notification** → Saves to DB + sends FCM push
4. **User receives push** → Notification appears on device
5. **User taps notification** → App opens to relevant screen

## API Endpoints

### Register Device Token
```http
POST /api/notifications/device-token
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "deviceToken": "fcm-token-here",
  "deviceType": "ANDROID"  // or "IOS"
}
```

### Unregister Device Token
```http
DELETE /api/notifications/device-token
Content-Type: application/json

{
  "deviceToken": "fcm-token-here"
}
```

## Testing Push Notifications

### Test from Backend

```bash
# Create a notification (will trigger push)
curl -X POST http://localhost:8084/internal/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "type": "CARD_CREATED",
    "title": "New Card Issued",
    "message": "Your new Visa card ending in 3456 is ready.",
    "referenceId": 123
  }'
```

### Test from Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Click "Send test message"
5. Enter your FCM token
6. Click "Test"

## Notification Data Payload

Each push notification includes:

```json
{
  "notification": {
    "title": "New Card Issued",
    "body": "Your new Visa card ending in 3456 is ready."
  },
  "data": {
    "type": "CARD_CREATED",
    "referenceId": "123",
    "click_action": "FLUTTER_NOTIFICATION_CLICK"
  }
}
```

Use the `data` payload to navigate to the correct screen when user taps notification.

## Troubleshooting

### "Firebase not configured" in logs
- Check that `firebase.enabled=true` in application.yml
- Verify service account JSON is valid
- Check file path or base64 encoding

### "Invalid device token" error
- Token may have expired or been unregistered
- User may have uninstalled/reinstalled app
- Get fresh token from device

### Push not received on device
- Check device has internet connection
- Verify FCM token is registered in database
- Check Firebase Console → Cloud Messaging for delivery status
- Ensure app has notification permissions

### iOS not receiving notifications
- Check APNs certificate is configured in Firebase
- Verify app has notification permissions
- Test with Firebase Console first

## Security Notes

1. **Never commit** `firebase-service-account.json` to git
2. Add to `.gitignore`:
   ```
   **/firebase-service-account.json
   ```
3. Use environment variables in production
4. Rotate service account keys periodically
5. Use separate Firebase projects for dev/staging/prod

## Production Checklist

- [ ] Firebase project created
- [ ] Service account key generated
- [ ] Environment variable configured
- [ ] Mobile app configured with `google-services.json` / `GoogleService-Info.plist`
- [ ] Device token registration implemented in mobile app
- [ ] Push notification handling implemented
- [ ] Tested on both Android and iOS
- [ ] Service account key secured (not in git)

## References

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [FCM HTTP v1 API](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)
