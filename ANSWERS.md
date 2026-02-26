# Backend Developer Technical Challenge – ANSWERS

---

## 1. What was your approach (thought process) to tackling this project?

I approached this problem by first identifying the core responsibilities of the system and separating them clearly:

1. Accept portfolio input and investment amount
2. Validate input safely
3. Perform financial allocation logic
4. Calculate share quantities with configurable precision
5. Determine valid execution date
6. Store and retrieve historic orders
7. Ensure performance instrumentation
8. Keep the design extensible and production-aware

I designed the solution using a layered architecture:

- Controller Layer → HTTP handling and request validation
- Service Layer → Core business logic
- Repository Layer → In-memory data storage
- Utility Layer → Market execution logic
- Config Layer → Share precision and default price configuration

Since this is a financial domain problem, I prioritized correctness in rounding and allocation logic to prevent floating-point drift — a common issue in financial systems.

---

## 2. What assumptions did you make?

While the requirements were intentionally ambiguous, I made the following assumptions:

1. Portfolio weights must total 100% (with a small floating tolerance).
2. Market execution considers only weekends (Saturday and Sunday) as closed.
3. Market holidays are not considered for this proof-of-concept.
4. Default stock price is $100 if not provided in the request.
5. BUY and SELL use identical allocation logic.
6. Data persistence beyond application restart is not required.
7. No authentication or authorization is required for this POC.
8. Order execution scheduling is informational only (no async execution engine required).

All assumptions are documented to demonstrate clarity in handling ambiguity.

---

## 3. What challenges did you face when creating your solution?

### 1. Floating-Point Precision

JavaScript floating-point arithmetic can introduce rounding errors.

Example:
100 × 33.33% may not sum to exactly 100.

To address this:
- Currency values are rounded to 2 decimal places.
- Share quantities are rounded to configurable precision.
- The last stock allocation is adjusted to absorb rounding drift.

This guarantees:

Sum of allocations = Total investment amount.

---

### 2. Configurable Share Precision

The requirement specifies that share precision must be configurable.

To address this:
- Share precision is defined in a centralized config file.
- The rounding helper method reads from configuration.
- No business logic needs modification if precision changes.

---

### 3. Validation Robustness

Since price is optional but must override default when provided, validation required careful use of:

- @IsOptional()
- @IsNumber()
- Minimum constraints

This ensures correct validation without rejecting valid requests.

---

### 4. Financial Safety Design

Separating rounding logic for:
- Currency (2 decimals)
- Shares (configurable precision)

Improves clarity and reflects real-world trading systems.

---

## 4. If you were to migrate this code from standalone format to a fully functional production environment, what changes and controls would you put in place?

If migrating to production, I would implement improvements across multiple dimensions:

---

### A. Security Controls

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Input sanitization hardening
- Request validation logging
- CORS policy restriction

---

### B. Data & Persistence

- Replace in-memory repository with PostgreSQL
- Add transactional consistency for order creation
- Implement idempotency keys to prevent duplicate orders
- Add order status tracking (PENDING, EXECUTED, FAILED)

---

### C. Observability & Monitoring

- Structured logging (Winston or Pino)
- Metrics collection (Prometheus)
- Centralized log aggregation
- Error tracking (Sentry)
- Health check endpoints

---

### D. Scalability

- Docker containerization
- Horizontal scaling behind load balancer
- Redis caching layer
- Stateless service design

---

### E. Market & Pricing Integration

- Integrate real-time stock pricing API
- Integrate real market calendar API (including holidays)
- Support asynchronous order execution engine

---

### F. DevOps & CI/CD

- Automated test pipeline
- Linting & formatting checks
- Code coverage enforcement
- Versioned releases
- Environment-based configuration management

---

## 5. If you’ve used LLMs to solve the challenge, describe how and where you’ve used it and how it helped you.

I used LLM assistance in the following areas:

- Structuring initial NestJS boilerplate
- Reviewing rounding strategies for financial correctness
- Generating unit test coverage patterns
- Validating architecture decisions
- Improving documentation clarity

However:

- All financial logic was manually reviewed.
- All edge cases were validated through testing.
- Architecture decisions were intentionally chosen and refined.

The LLM acted as a productivity accelerator, not as a replacement for architectural reasoning.

---

## Additional Design Considerations

### 1. Financial Allocation Integrity

To avoid floating drift:
- All intermediate currency calculations are rounded.
- The final allocation ensures exact equality with totalAmount.

This reflects behavior commonly used in financial trading systems.

---

### 2. Clean Separation of Concerns

The system clearly separates:
- HTTP concerns
- Business logic
- Data storage
- Configuration
- Utility functions

This improves:
- Testability
- Maintainability
- Extensibility

---

### 3. Test Coverage Strategy

Unit tests cover:

- Correct allocation split
- Weight validation
- Floating precision handling
- Price override priority
- Repository interaction
- Historic order retrieval

This ensures confidence in core business logic.

---

## Summary

This implementation focuses on:

- Clean architecture
- Financial correctness
- Configurable precision
- Robust validation
- Extensibility
- Production-aware thinking

The system is intentionally built as a proof-of-concept while maintaining a strong foundation for future production migration.

---

Thank you for the opportunity to complete this technical challenge.