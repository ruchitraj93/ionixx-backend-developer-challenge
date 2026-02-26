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