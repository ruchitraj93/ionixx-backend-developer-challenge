# Order Splitter API – Backend Developer Technical Challenge

## Overview

This project implements a RESTful Order Splitter API for a robo-advisor proof-of-concept.

The service accepts:
- A model portfolio (stocks + weight distribution)
- A total investment amount
- Order type (BUY / SELL)

It returns:
- Allocated amount per stock
- Quantity of shares to buy/sell
- Execution date (market open days only)
- Historic order retrieval

The application is built using NestJS with TypeScript and follows clean, layered architecture principles.

---

# Architecture Overview

The application follows a layered design:

Controller Layer → Handles HTTP requests  
Service Layer → Contains business logic  
Repository Layer → In-memory storage  
Utility Layer → Market calendar logic  
Config Layer → Precision and default values  

Key Design Considerations:
- Financial-safe rounding
- Floating-point drift prevention
- Configurable share precision
- Weekend market execution logic
- No data persistence after restart (as required)

---

# Tech Stack

- Node.js
- NestJS
- TypeScript
- class-validator
- Swagger (OpenAPI)
- Jest (Unit Testing)

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd order-splitter
```

## 2. Install Dependencies

```bash
npm install
```

---

# Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

Application will start on:

```
http://localhost:3000
```

---

# Swagger API Documentation

Swagger UI is enabled for interactive testing.

Access Swagger at:

```
http://localhost:3000/api
```

You can:
- Test endpoints directly
- View request/response schemas
- Validate input formats

---

# API Endpoints

## 1️⃣ Create Order

### POST `/orders`

Creates a new order based on the portfolio allocation.

### Request Body

```json
{
  "orderType": "BUY",
  "totalAmount": 100,
  "portfolio": [
    { "symbol": "AAPL", "weight": 60 },
    { "symbol": "TSLA", "weight": 40 }
  ]
}
```

### Request Fields

| Field | Type | Description |
|--------|--------|-------------|
| orderType | BUY / SELL | Order type |
| totalAmount | number | Total investment amount |
| portfolio | array | Stock distribution |

Each portfolio item:

| Field | Type | Required | Description |
|--------|--------|----------|-------------|
| symbol | string | Yes | Stock symbol |
| weight | number | Yes | Percentage weight (must total 100) |
| price | number | No | Market price override |

---

### Response

```json
{
  "id": "generated-uuid",
  "orderType": "BUY",
  "totalAmount": 100,
  "executionDate": "2026-02-26",
  "createdAt": "2026-02-26T10:15:00.000Z",
  "breakdown": [
    {
      "symbol": "AAPL",
      "allocatedAmount": 60,
      "price": 100,
      "quantity": 0.6
    },
    {
      "symbol": "TSLA",
      "allocatedAmount": 40,
      "price": 100,
      "quantity": 0.4
    }
  ]
}
```

---

## 2️⃣ Get Historic Orders

### GET `/orders`

Returns all previously created orders during the current runtime.

Example Response:

```json
[
  {
    "id": "generated-uuid",
    "orderType": "BUY",
    "totalAmount": 100,
    "executionDate": "2026-02-26",
    "createdAt": "timestamp",
    "breakdown": [...]
  }
]
```

---

# Business Logic Details

## Allocation Calculation

For each stock:

allocatedAmount = (totalAmount × weight) / 100  
quantity = allocatedAmount / stockPrice  

---

## Financial Safety Measures

- Currency rounded to 2 decimal places
- Share quantity rounded to configurable precision
- Last stock allocation adjusted to prevent floating-point drift

This guarantees:

Sum of allocations = Total investment

---

# Configurable Share Precision

Defined in:

```
src/config/app.config.ts
```

Example:

```ts
SHARE_DECIMAL_PLACES: 3
```

This can be changed without modifying business logic.

---

# Market Execution Logic

Markets are open Monday through Friday.

If today is:
- Saturday → Execution set to Monday
- Sunday → Execution set to Monday
- Weekday → Execution set to today

Market holidays are not included in this POC.

---

# Running Unit Tests

Run all unit tests:

```bash
npm run test
```

Expected output:

```
PASS src/orders/orders.service.spec.ts
```

Tests cover:
- Allocation correctness
- Floating precision handling
- Weight validation
- Price override logic
- Repository storage
- Historic order retrieval

---

# Performance Instrumentation

Each API call logs response time in milliseconds.

Example:

```
Response time: 12ms
```

Implemented using a global interceptor.

---

# Validation Rules

- Portfolio weights must total 100% (with tolerance)
- totalAmount must be greater than 0
- weight must be positive
- price (if provided) must be positive
- portfolio cannot be empty

---

# Assumptions

- Default stock price is $100 if not provided
- Portfolio weights must sum to 100%
- Weekend-only market closure logic
- No authentication required (POC)
- Data stored only in memory

---

# Production-Level Improvements (Future Scope)

If migrating to production:

- Database integration (PostgreSQL)
- JWT authentication
- Role-based authorization
- Rate limiting
- Idempotency keys
- Redis caching
- Centralized logging
- Monitoring & metrics
- Dockerization
- CI/CD pipeline
- Real stock price API integration
- Real market calendar integration

---

# Project Structure

```
src/
├── main.ts
├── app.module.ts
├── config/
├── common/
├── orders/
```

---

# Author

Backend Developer Technical Challenge Submission