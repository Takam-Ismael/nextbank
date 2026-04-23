# Firebase Push Notifications - Quick Setup

## Do I Need This?

**NO** - Notifications work without Firebase. They're saved to database and users can see them in the app.

**YES** - If you want real-time push notifications to appear on user's phone even when app is closed.

## Setup (5 minutes)

### 1. Get Firebase Key

1. Go to https://console.firebase.google.com/
2. Create new project (or use existing)
3. Click gear icon → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate new private key"
6. Download the JSON file

### 2. Add to Project

Put the downloaded file here:
```
Backend-Services/notifications-service/src/main/resources/firebase-service-account.json
```

### 3. Restart Service

```bash
cd Backend-Services/notifications-service
./mvnw spring-boot:run
```

Look for this log message:
```
Firebase initialized successfully for push notifications
```

## That's It!

Now when a notification is created:
1. ✅ Saved to database (always works)
2. ✅ Push sent to user's devices (if Firebase configured)

## Disable Firebase

In `application.yml`:
```yaml
firebase:
  enabled: false
```

## Mobile App Setup (Later)

The mobile app needs to:
1. Install Firebase SDK
2. Get FCM token
3. Send token to backend: `POST /api/notifications/device-token`

See `FIREBASE_SETUP.md` for complete mobile integration guide.

## Testing

```bash
# Create a notification
curl -X POST http://localhost:8084/internal/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "type": "CARD_CREATED",
    "title": "Test Push",
    "message": "This should appear on device",
    "referenceId": 123
  }'
```

If Firebase is configured and user has registered device token, they'll receive a push notification.
