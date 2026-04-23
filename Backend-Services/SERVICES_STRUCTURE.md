# NextBank Microservices Structure

## Complete Services Overview

### 1. Accounts Service (Port: 8085) ✅ COMPLETE
- **Database**: accounts_db
- **Responsibilities**: Authentication (QR+OTP), User Management, Account CRUD, Internal Credit/Debit
- **Structure**: ✅ Complete Maven Spring Boot structure

### 2. Cards Service (Port: 8083) ✅ COMPLETE
- **Database**: cards_db
- **Responsibilities**: Card issuance (Luhn validation), Card management, Freeze/Unfreeze
- **Structure**: ✅ Complete Maven Spring Boot structure

```
Backend-Services/cards-service/
├── .gitignore
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/nextbank/cards/
    │   │   ├── CardsApplication.java
    │   │   ├── client/
    │   │   │   ├── AccountsClient.java
    │   │   │   └── NotificationsClient.java
    │   │   ├── config/
    │   │   │   └── RestTemplateConfig.java
    │   │   ├── controller/
    │   │   │   ├── AdminCardController.java
    │   │   │   └── CardController.java
    │   │   ├── dto/
    │   │   │   ├── CardRequestDto.java
    │   │   │   └── CardResponseDto.java
    │   │   ├── entity/
    │   │   │   └── Card.java
    │   │   ├── repository/
    │   │   │   └── CardRepository.java
    │   │   ├── security/
    │   │   │   ├── JwtFilter.java
    │   │   │   ├── JwtUtil.java
    │   │   │   └── SecurityConfig.java
    │   │   └── service/
    │   │       ├── CardService.java
    │   │       └── LuhnValidator.java
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/
    │           └── V1__init_cards.sql
    └── test/
        └── java/com/nextbank/cards/
            └── CardsApplicationTests.java
```

### 3. Notifications Service (Port: 8084) ✅ COMPLETE
- **Database**: notifications_db
- **Responsibilities**: Notification storage, Notification delivery, Read/Unread tracking
- **Structure**: ✅ Complete Maven Spring Boot structure

```
Backend-Services/notifications-service/
├── .gitignore
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/nextbank/notifications/
    │   │   ├── NotificationsServiceApplication.java
    │   │   ├── controller/
    │   │   │   ├── AdminNotificationController.java
    │   │   │   ├── InternalNotificationController.java
    │   │   │   └── NotificationController.java
    │   │   ├── dto/
    │   │   │   ├── NotificationRequest.java
    │   │   │   └── NotificationResponse.java
    │   │   ├── entity/
    │   │   │   └── Notification.java
    │   │   ├── repository/
    │   │   │   └── NotificationRepository.java
    │   │   ├── security/
    │   │   │   ├── JwtFilter.java
    │   │   │   ├── JwtUtil.java
    │   │   │   └── SecurityConfig.java
    │   │   └── service/
    │   │       └── NotificationService.java
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/
    │           └── V1__init_notifications.sql
    └── test/
        └── java/com/nextbank/notifications/
            └── NotificationsServiceApplicationTests.java
```

## API Endpoints Summary

### Cards Service Endpoints

**Customer Endpoints:**
- `GET /api/cards/my` - List own cards (last 4 digits only)
- `GET /api/cards/{id}` - View single card detail
- `POST /api/cards/request` - Request new card
- `PATCH /api/cards/{id}/freeze` - Freeze/unfreeze card

**Admin Endpoints:**
- `GET /api/cards/admin/all` - View all cards (paginated)

### Notifications Service Endpoints

**Customer Endpoints:**
- `GET /api/notifications/my` - List own notifications
- `GET /api/notifications/my/unread-count` - Get unread count
- `PATCH /api/notifications/{id}/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

**Admin Endpoints:**
- `GET /api/notifications/admin/all` - View all notifications (paginated)

**Internal Endpoints:**
- `POST /internal/notifications` - Create notification (service-to-service only)

## Service Communication

```
Cards Service → Accounts Service (verify account ownership)
Cards Service → Notifications Service (send card events)
Transactions Service → Notifications Service (send transaction events)
Accounts Service → Notifications Service (send account events)
```

## Database Schemas

### cards_db
- **cards** table: id, user_id, account_id, account_number, card_number, card_last_four, card_type, cvv_hash, expiry_month, expiry_year, cardholder_name, status, created_at, updated_at

### notifications_db
- **notifications** table: id, user_id, type, title, message, is_read, reference_id, created_at

## Configuration

All services use:
- **Spring Boot**: 3.2.5
- **Java**: 17
- **Database**: PostgreSQL
- **Security**: JWT (shared secret)
- **Build Tool**: Maven

## Next Steps

1. Build all services: `mvn clean install` in each service directory
2. Start PostgreSQL databases (cards_db, notifications_db)
3. Run services:
   - Cards: `mvn spring-boot:run` (port 8083)
   - Notifications: `mvn spring-boot:run` (port 8084)
4. Test endpoints with Postman/curl
5. Update Kong configuration to route to new services
