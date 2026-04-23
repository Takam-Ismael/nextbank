# NextBank Backend Services - Setup Guide

## Quick Start

### 1. Prerequisites
- Java 17
- PostgreSQL
- Maven

### 2. Create Databases

```sql
CREATE DATABASE accounts_db;
CREATE DATABASE cards_db;
CREATE DATABASE notifications_db;
```

### 3. Start Services

#### Accounts Service (Port 8085)
```bash
cd Backend-Services/accounts-service
./mvnw spring-boot:run
```

#### Cards Service (Port 8083)
```bash
cd Backend-Services/cards-service
./mvnw spring-boot:run
```

#### Notifications Service (Port 8084)
```bash
cd Backend-Services/notifications-service
./mvnw spring-boot:run
```

## Push Notifications Setup (Optional)

### Without Firebase (Default - Notifications work but no push)
- Notifications are saved to database
- Users can see them in the app
- No real-time push to devices
- **No configuration needed**

### With Firebase (Real Push Notifications)

#### Step 1: Get Firebase Service Account Key

1. Go to https://console.firebase.google.com/
2. Create project or select existing
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file

#### Step 2: Configure Backend

**Option A: Put file in project (Easy for testing)**
```bash
# Copy the downloaded file
cp ~/Downloads/nextbank-firebase-xxxxx.json Backend-Services/notifications-service/src/main/resources/firebase-service-account.json
```

**Option B: Use environment variable (Production)**
```bash
# Convert to base64
base64 -w 0 firebase-service-account.json

# Set environment variable
export FIREBASE_SERVICE_ACCOUNT_KEY_BASE64="<paste-base64-here>"
```

#### Step 3: Restart Notifications Service
```bash
cd Backend-Services/notifications-service
./mvnw spring-boot:run
```

You should see: `Firebase initialized successfully for push notifications`

#### Step 4: Mobile App Setup (Later)
- Install Firebase in React Native app
- Get FCM token
- Register token with backend: `POST /api/notifications/device-token`

## Testing

### Test Cards Service
```bash
# Get JWT token from accounts service first
TOKEN="your-jwt-token"

# Request a card
curl -X POST http://localhost:8083/api/cards/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 1}'
```

### Test Notifications Service
```bash
# Create notification (internal endpoint - no auth needed)
curl -X POST http://localhost:8084/internal/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "type": "CARD_CREATED",
    "title": "Test Notification",
    "message": "This is a test",
    "referenceId": 123
  }'

# Get notifications (needs JWT)
curl http://localhost:8084/api/notifications/my \
  -H "Authorization: Bearer $TOKEN"
```

## Configuration Files

### Accounts Service
`Backend-Services/accounts-service/src/main/resources/application.yml`
```yaml
server:
  port: 8085
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/accounts_db
    username: postgres
    password: root
```

### Cards Service
`Backend-Services/cards-service/src/main/resources/application.yml`
```yaml
server:
  port: 8083
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cards_db
    username: postgres
    password: root
accounts-service:
  url: http://localhost:8085
notifications-service:
  url: http://localhost:8084
```

### Notifications Service
`Backend-Services/notifications-service/src/main/resources/application.yml`
```yaml
server:
  port: 8084
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/notifications_db
    username: postgres
    password: root
firebase:
  enabled: true  # Set to false to disable push notifications
```

## Troubleshooting

### Service won't start
- Check PostgreSQL is running
- Check database exists
- Check port is not in use

### Firebase errors
- Set `firebase.enabled: false` in application.yml to disable
- Check service account JSON is valid
- See `Backend-Services/notifications-service/FIREBASE_SETUP.md` for details

### Cards service can't reach accounts service
- Check accounts service is running on port 8085
- Check `accounts-service.url` in cards application.yml

## What Works Now

✅ **Accounts Service**: User registration, login, JWT generation with userId
✅ **Cards Service**: Card creation with Luhn validation, freeze/unfreeze
✅ **Notifications Service**: 
  - Store notifications in database
  - Send push notifications via FCM (if configured)
  - Device token registration
  - Mark as read/unread

## Next Steps

1. Start all three services
2. Test with Postman/curl
3. Configure Firebase (optional, for push notifications)
4. Integrate with mobile app
