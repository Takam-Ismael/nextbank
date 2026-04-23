# Cards Service - NextBank

Bank-issued virtual cards management microservice for NextBank digital banking platform.

## Overview

The Cards Service manages all bank-issued virtual cards linked to customer accounts. It handles card creation with Luhn-valid number generation, freeze/unfreeze operations, and card listing.

## Features

- **Card Issuance**: Generate Luhn-valid 16-digit card numbers (Visa/Mastercard)
- **CVV Security**: BCrypt hashed CVV storage (never returned in API)
- **Card Management**: List, view, freeze/unfreeze cards
- **Account Linking**: Cards linked to specific NextBank accounts
- **Notifications**: Automatic notifications for card events
- **Admin Dashboard**: View all cards across platform

## Technology Stack

- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **Database**: PostgreSQL (cards_db)
- **Security**: JWT Authentication, BCrypt password encoding
- **Build Tool**: Maven
- **Migration**: Flyway

## Port

- **Service Port**: 8083

## Database Schema

```sql
CREATE TABLE cards (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    account_id      BIGINT NOT NULL,
    account_number  VARCHAR(20) NOT NULL,
    card_number     VARCHAR(16) NOT NULL UNIQUE,
    card_last_four  VARCHAR(4) NOT NULL,
    card_type       VARCHAR(20) NOT NULL,
    cvv_hash        VARCHAR(255) NOT NULL,
    expiry_month    SMALLINT NOT NULL,
    expiry_year     SMALLINT NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Customer Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards/my` | List own cards (last 4 digits only) |
| GET | `/api/cards/{id}` | View single card detail |
| POST | `/api/cards/request` | Request new bank-issued card |
| PATCH | `/api/cards/{id}/freeze` | Freeze or unfreeze card |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards/admin/all` | View all cards (paginated) |

## Card Request Flow

1. Customer selects account for card linkage
2. Service verifies account ownership via Accounts Service
3. Service verifies account is ACTIVE
4. Generate 16-digit Luhn-valid card number (prefix 4=Visa, 5=Mastercard)
5. Generate 3-digit CVV and BCrypt hash it
6. Set expiry date (current date + 3 years)
7. Save card record with status ACTIVE
8. Send notification via Notifications Service
9. Return card details (last 4 digits only, no CVV)

## Luhn Algorithm

The service implements Luhn algorithm for card number validation and generation:

```java
// Validate existing card number
boolean isValid = LuhnValidator.validate("4532015112830366");

// Generate new Luhn-valid card number
String cardNumber = LuhnValidator.generate("4"); // Visa prefix
```

## Configuration

### application.yml

```yaml
server:
  port: 8083

spring:
  application:
    name: cards-service
  datasource:
    url: jdbc:postgresql://localhost:5432/cards_db
    username: postgres
    password: root

jwt:
  secret: secret_key_placeholder_for_nextbank_digital_platform_2024
  expiration: 86400000

accounts-service:
  url: http://localhost:8085

notifications-service:
  url: http://localhost:8084
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
docker build -t nextbank/cards-service .
docker run -p 8083:8083 nextbank/cards-service
```

## Service Dependencies

- **Accounts Service** (port 8085): Verify account ownership and status
- **Notifications Service** (port 8084): Send card event notifications

## Security

- JWT-based authentication (shared secret with Accounts Service)
- Role-based access control (CUSTOMER, ADMIN)
- CVV stored as BCrypt hash (never returned in API responses)
- Card numbers encrypted at rest (recommended for production)

## Testing

```bash
./mvnw test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/nextbank/cards/
│   │   ├── CardsApplication.java
│   │   ├── client/          # REST clients for other services
│   │   ├── config/          # Configuration classes
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
    └── java/com/nextbank/cards/
```

## Author

NextBank Development Team - Group 5
