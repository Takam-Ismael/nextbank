# Test All Services

## 1. Start Services

Open 3 terminals:

**Terminal 1 - Accounts Service**
```bash
cd Backend-Services/accounts-service
./mvnw spring-boot:run
```
Wait for: `Started AccountsServiceApplication`

**Terminal 2 - Cards Service**
```bash
cd Backend-Services/cards-service
./mvnw spring-boot:run
```
Wait for: `Started CardsApplication`

**Terminal 3 - Notifications Service**
```bash
cd Backend-Services/notifications-service
./mvnw spring-boot:run
```
Wait for: 
- `Started NotificationsServiceApplication`
- `Firebase initialized successfully for push notifications` ✅

## 2. Test Notifications Service

### Create a test notification
```bash
curl -X POST http://localhost:8084/internal/notifications \
  -H "Content-Type: application/json" \
  -d "{\"userId\": 1, \"type\": \"CARD_CREATED\", \"title\": \"Test Notification\", \"message\": \"Firebase is working!\", \"referenceId\": 123}"
```

Expected response:
```json
{
  "id": 1,
  "userId": 1,
  "type": "CARD_CREATED",
  "title": "Test Notification",
  "message": "Firebase is working!",
  "isRead": false,
  "referenceId": 123,
  "createdAt": "2024-..."
}
```

Check logs - you should see:
```
No active device tokens found for user 1
```
This is normal - no mobile devices registered yet.

## 3. Test Cards Service (Needs JWT)

First, get a JWT token from accounts service (you need a registered user).

```bash
# Example with JWT
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:8083/api/cards/request \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"accountId": 1}'
```

This will:
1. Create a card
2. Call notifications service
3. Notification saved to DB
4. Push notification attempted (will skip if no device tokens)

## 4. Verify Database

```sql
-- Check notifications were created
SELECT * FROM notifications_db.notifications;

-- Check device tokens (should be empty for now)
SELECT * FROM notifications_db.device_tokens;

-- Check cards
SELECT * FROM cards_db.cards;
```

## Success Indicators

✅ All 3 services start without errors
✅ Notifications service shows "Firebase initialized successfully"
✅ Can create notifications via internal endpoint
✅ Notifications saved to database
✅ Cards service can create cards
✅ Cards service calls notifications service

## What's Working

1. **Accounts Service**: JWT with userId ✅
2. **Cards Service**: Card creation, Luhn validation ✅
3. **Notifications Service**: 
   - Store notifications ✅
   - Firebase configured ✅
   - Ready to send push (when devices register) ✅

## Next Steps

- Mobile app needs to register FCM device tokens
- Then push notifications will be delivered to devices
- For now, notifications work in-app (stored in database)
