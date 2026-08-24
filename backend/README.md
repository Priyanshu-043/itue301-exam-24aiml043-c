# FitZone Class Booking Backend

A clean Express REST API for FitZone gym class bookings using MongoDB, Mongoose and JWT authentication.

## Implemented tasks

### Task 3 — Express REST API + Middleware

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | Public | Create a member account and issue JWT |
| POST | `/api/v1/auth/login` | Public | Sign in with email and password and issue JWT |
| GET | `/api/v1/trainers` | Public | Return all trainers |
| POST | `/api/v1/bookings` | Bearer JWT | Create a class booking |
| GET | `/api/v1/bookings/my` | Bearer JWT | Return logged-in member bookings |
| PATCH | `/api/v1/bookings/:id/status` | Bearer JWT | Update one of the member's booking statuses |

Middleware:

- `requestLogger` is global and uses `res.on('finish')` to log method, path, final status and response time.
- `authGuard` validates a Bearer JWT, looks up the member, and attaches it to `req.member`.
- `errorHandler` is the last middleware and returns structured JSON.

### Task 5 — MongoDB + Mongoose

Models:

- `Member`: `name`, `email`, `phone`, `membershipType`
- `Trainer`: `name`, `specialization`, `available`
- `ClassBooking`: `memberId`, `trainerId`, `className`, `date`, `timeSlot`, `status`

Mongoose refs:

- `ClassBooking.memberId -> Member`
- `ClassBooking.trainerId -> Trainer`

`GET /api/v1/bookings/my` uses both required populate calls.

## System architecture

```text
Client / Postman / Thunder Client
              |
              v
        Express REST API
              |
      +-------+--------+
      |                |
 requestLogger      authGuard
      |                |
      +-------+--------+
              |
        Route / Controller
              |
           Mongoose
              |
           MongoDB

Global errorHandler is registered last.
```

Request flow for protected booking APIs:

```text
HTTP Request
   -> CORS + JSON parser
   -> requestLogger
   -> /api/v1/bookings router
   -> authGuard
   -> controller
   -> Mongoose model
   -> MongoDB
   -> JSON response
   -> res.finish
   -> requestLogger prints final status + response time
```

## Project structure

```text
fitzone-backend/
├── docs/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── trainerController.js
│   ├── middleware/
│   │   ├── authGuard.js
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── models/
│   │   ├── ClassBooking.js
│   │   ├── Member.js
│   │   └── Trainer.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── trainerRoutes.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB local instance or MongoDB Atlas

## Execution steps

1. Open the project folder.
2. Install packages:

```bash
npm install
```

3. Create `.env` from `.env.example`.
4. Put the MongoDB connection string into `MONGO_URI`.
5. Set a strong `JWT_SECRET`.
6. Start the API:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

7. Verify:

```text
GET http://localhost:5000/health
```

## Authentication

Members can create an account with `POST /api/v1/auth/signup` and sign in with `POST /api/v1/auth/login`. Passwords are hashed with `bcryptjs`; the raw password is never stored in MongoDB. JWTs are returned by both endpoints and must be sent as `Authorization: Bearer <JWT>` on protected booking routes.

### Sign up

`POST /api/v1/auth/signup`

```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "password": "secret123",
  "membershipType": "premium"
}
```

The endpoint returns `201` with a JWT. `membershipType` is optional and defaults to `basic`.

### Login

`POST /api/v1/auth/login`

```json
{
  "email": "priya@example.com",
  "password": "secret123"
}
```

The endpoint returns `200` with a JWT. Invalid credentials return `401`.

## Initial data

Create at least one trainer in MongoDB before testing the protected booking endpoints. Create members through the `/api/v1/auth/signup` endpoint so their password is hashed correctly.

Example Trainer document:

```json
{
  "name": "Arjun Mehta",
  "specialization": "Strength Training",
  "available": true
}
```

## API examples

### 1. Sign up

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "password": "secret123",
  "membershipType": "premium"
}
```

Expected response: `201` with a JWT.

### 2. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "priya@example.com",
  "password": "secret123"
}
```

Expected response: `200` with a JWT.

### 1. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "priya@example.com"
}
```

Expected response: `200`

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT>",
  "member": {
    "id": "<member-id>",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "membershipType": "premium"
  }
}
```

### 2. Public trainer listing

```http
GET /api/v1/trainers
```

Expected response: `200`

### 3. Create booking

Header:

```text
Authorization: Bearer <JWT>
Content-Type: application/json
```

Body:

```json
{
  "trainerId": "<trainer-id>",
  "className": "Strength Training",
  "date": "2026-08-28",
  "timeSlot": "07:00-08:00"
}
```

Expected response: `201`.

### 4. My bookings

```http
GET /api/v1/bookings/my
Authorization: Bearer <JWT>
```

Expected response: `200`.

The response contains populated member and trainer details.

### 5. Update booking status

```http
PATCH /api/v1/bookings/<booking-id>/status
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "status": "cancelled"
}
```

Expected response: `200`.

## Validation demonstration

Example invalid member document:

```json
{
  "name": "Test Member",
  "email": "invalid@example.com",
  "membershipType": "gold"
}
```

Mongoose rejects `membershipType: "gold"` because only `basic`, `premium`, and `platinum` are allowed. The global error middleware converts the validation failure into structured JSON such as:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "membershipType must be basic, premium, or platinum"
  ]
}
```

A missing required booking field is handled similarly and returns `400`.

## HTTP status codes used

- `200` — successful GET / PATCH and login
- `201` — booking successfully created
- `400` — validation or invalid booking input
- `401` — missing or invalid authentication
- `404` — unknown route
- `500` — unexpected server error

## Test checklist for Postman / Thunder Client

Use the requests in `docs/api-test-requests.md` in this order:

1. Health check
2. Public trainer list
3. Login and copy the JWT
4. Create booking with JWT
5. Read my bookings with JWT
6. Update status with JWT
7. Call a protected endpoint without JWT and confirm `401`
8. Send invalid booking input and confirm `400`
9. Observe the terminal logger output, for example:

```text
[GET] [/api/v1/trainers] [200] [4.12 ms]
```

## Production improvements

- Add password hashing or OAuth/OTP authentication.
- Add trainer and admin login/authorization roles.
- Prevent overlapping bookings for the same trainer/time slot with database-level design and transaction/atomic checks.
- Add rate limiting and stronger input validation.
- Add automated tests and API documentation with OpenAPI/Swagger.
