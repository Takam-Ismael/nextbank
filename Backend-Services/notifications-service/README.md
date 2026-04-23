# Notifications Service - NextBank

Centralized notification management microservice with **Firebase Cloud Messaging (FCM)** push notifications for NextBank digital banking platform.

## Overview

The Notifications Service handles both **in-app notifications** (stored in database) and **real-time push notifications** (via FCM). When a notification is created, it:

1. **Saves to database** for notification history
2. **Sends push notification** to all user's registered devices (Android/iOS)

This is a passive receiver that stores and delivers notifications. Other services call it via internal REST after significant events.

## Features

- **Push Notifications**: Real-time FCM push notifications to Android/iOS devices
- **Device Management**: Register/unregister FCM device tokens
- **Event Storage**: Store all platform notifications in database
- **User Notifications**: List, filter, and mark notifications as read
- **Unread Count**: Badge count for mobile apps
- **Admin Dashboard**: View all notifications across platform
- **Internal API**: Service-to-service notification creation
- **Multi-Device Support**: Send to all user's registered devices

## Technology Stack

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: PostgreSQL (notifications_db)
- **Security**: JWT Authentication
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Build Tool**: Maven
- **Migration**: Flyway

## Port

- **Service Port**: 8084

## Database Schema

```sql
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    type            VARCHAR(30) NOT NULL,
    title           VARCHAR(100) NOT NULL,
    message         VARCHAR(500) NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id    BIGINT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Notification Types

| Type | Triggered By | Example Message |
|------|--------------|-----------------|
| WELCOME | Accounts - registration | Welcome to NextBank, John Doe! |
| ACCOUNT_FROZEN | Accounts - admin freeze | Your account ACC1234 has been frozen |
| ACCOUNT_UNFROZEN | Accounts - admin unfreeze | Your account ACC1234 has been reactivated |
| DEPOSIT_PENDING | Transactions - Stripe initiated | Your deposit of $500 is being processed |
| DEPOSIT_COMPLETED | Transactions - Stripe webhook | Your $500 deposit has been credited |
| DEPOSIT_FAILED | Transactions - Stripe failed | Your deposit of $500 could not be completed |
| TRANSFER_SENT | Transactions - transfer | You sent $250 to account ACC5678 |
| TRANSFER_RECEIVED | Transactions - transfer | You received $250 from account ACC1234 |
| WITHDRAWAL_PROCESSED | Transactions - withdrawal | 5000 XAF sent to Orange Money 699123456 |
| CARD_CREATED | Cards - card request | Your new Visa card ending in 3456 is ready |
| CARD_FROZEN | Cards - freeze | Your Visa card ending in 3456 has been frozen |
| CARD_UNFROZEN | Cards - unfreeze | Your Visa card ending in 3456 has been unfrozen |

## API Endpoints

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/device-token` | Register FCM device token |
| DELETE | `/api/notifications/device-token` | Unregister FCM device token |
| GET | `/api/notifications/my` | List own notifications (newest first) |
| GET | `/api/notifications/my/unread-count` | Get unread count for badge |
| PATCH | `/api/notifications/{id}/read` | Mark single notification as read |
| PATCH | `/api/notifications/read-all` | Mark all own notifications as read |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/admin/all` | View all notifications (paginated) |

### Internal Endpoints (Service-to-Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/internal/notifications` | Create notification (NOT exposed through Kong) |

## Internal API Usage

Other services call the internal endpoint to create notifications:

```json
POST /internal/notifications
{
  "userId": 42,
  "type": "CARD_CREATED",
  "title": "New Card Issued",
  "message": "Your new Visa card ending in 3456 is ready.",
  "referenceId": 123
}
```

## Configuration

### application.yml

```yaml
server:
  port: 8084

spring:
  application:
    name: notifications-service
  datasource:
    url: jdbc:postgresql://localhost:5432/notifications_db
    username: postgres
    password: root

jwt:
  secret: secret_key_placeholder_for_nextbank_digital_platform_2024
  expiration: 86400000
```

## Running the Service

### Prerequisites

- Java 17+
- PostgreSQL
- Maven 3.8+

### Build

```bash
./mvnw clean install
```

### Run

```bash
./mvnw spring-boot:run
```

### Docker

```bash
docker build -t nextbank/notifications-service .
docker run -p 8084:8084 nextbank/notifications-service
```

## Service Callers

The following services call Notifications Service:

- **Accounts Service** (port 8085): User registration, account freeze/unfreeze
- **Transactions Service** (port 8082): Deposits, transfers, withdrawals
- **Cards Service** (port 8083): Card creation, freeze/unfreeze

## Security

- JWT-based authentication (shared secret with Accounts Service)
- Role-based access control (CUSTOMER, ADMIN)
- Internal endpoints (`/internal/**`) are NOT protected by JWT (service-to-service trust)
- Customer endpoints require valid JWT
- Admin endpoints require ADMIN role

## Testing

```bash
./mvnw test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/nextbank/notifications/
│   │   ├── NotificationsServiceApplication.java
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # JPA repositories
│   │   ├── security/        # Security configuration
│   │   └── service/         # Business logic
│   └── resources/
│       ├── application.yml
│       └── db/migration/    # Flyway migrations
└── test/
    └── java/com/nextbank/notifications/
```

## Design Pattern

This service follows the **Passive Receiver** pattern:
- Does NOT initiate any actions
- Only responds to requests from other services
- Stores events for later retrieval
- Provides query interface for customers and admins

## Author

NextBank Development Team - Group 5
