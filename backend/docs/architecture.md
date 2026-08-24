# FitZone System Architecture

## Layers

1. **API layer** — Express routes define REST endpoints.
2. **Middleware layer** — request logging, JWT authentication and centralized error handling.
3. **Controller layer** — validates request-level rules and performs application operations.
4. **Data layer** — Mongoose models define MongoDB schemas, references and validation.
5. **Database layer** — MongoDB persists Members, Trainers and ClassBookings.

## Authentication flow

```text
Member email
   -> POST /api/v1/auth/login
   -> find Member by email
   -> sign JWT with memberId + role
   -> return token

Protected request
   -> Authorization: Bearer <JWT>
   -> authGuard verifies token
   -> find member
   -> req.member = member
   -> booking controller
```

## Booking flow

```text
POST /api/v1/bookings
   -> authGuard
   -> validate trainerId/className/date/timeSlot
   -> verify logged-in member
   -> verify trainer
   -> create ClassBooking
   -> Mongoose validation
   -> MongoDB save
   -> 201 JSON response
```


### Authentication flow
1. `POST /auth/signup` validates fields, hashes the password with bcrypt, stores the member, and returns a JWT.
2. `POST /auth/login` verifies the password against `passwordHash` and returns a JWT.
3. `authGuard` verifies the JWT, loads the member, and attaches it to `req.member`.
