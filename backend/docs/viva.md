# FitZone Backend — Viva Questions and Answers

## 1. Why did you use Express?

Express is a lightweight Node.js web framework used to create HTTP routes and middleware cleanly. It keeps the API simple and modular.

## 2. What is middleware?

Middleware is a function that runs during the request-response cycle. It can inspect or modify the request, modify the response, perform authentication, log requests, or pass control using `next()`.

## 3. Why is requestLogger applied globally?

The requirement is to log every request. Registering it with `app.use(requestLogger)` makes it run for all incoming routes.

## 4. Why use `res.on('finish')`?

The `finish` event occurs when the response has been sent to the client. At that point `res.statusCode` contains the final HTTP status, so the logger can record the real result of the request.

## 5. Why use `process.hrtime.bigint()` for response time?

It gives a high-resolution monotonic timer. The code converts the elapsed nanoseconds into milliseconds and prints the value.

## 6. What does Bearer authentication mean?

The client sends a token in the `Authorization` header as `Bearer <token>`. The server verifies the token before allowing access to protected routes.

## 7. What does authGuard do?

It reads the Authorization header, verifies the JWT, loads the member from MongoDB, and stores that member in `req.member` for downstream controllers.

## 8. Why attach `req.member`?

It prevents controllers from repeatedly extracting and verifying the token. The booking controller can directly use `req.member._id` to associate a booking with the logged-in member.

## 9. Why are `/auth/login` and `/trainers` public?

The assignment explicitly says these two routes do not require authentication. Login must be reachable without a token, and the trainer listing is public.

## 10. Why is `/api/v1/bookings` protected?

A booking belongs to a logged-in member, so the API must know the member identity before creating or reading bookings.

## 11. Why does login return `200` instead of `201`?

Login is an authentication operation, not the creation of a new resource. `200 OK` is appropriate for a successful login response.

## 12. Why does create booking return `201`?

A new ClassBooking resource is created in MongoDB, so `201 Created` is appropriate.

## 13. Why use Mongoose?

Mongoose provides schemas, validation, model APIs, references and population on top of MongoDB.

## 14. What is a Mongoose reference?

A reference stores another document's ObjectId and declares the target model. Here `memberId` references `Member` and `trainerId` references `Trainer`.

## 15. What does `populate()` do?

It replaces referenced ObjectIds with selected fields from the referenced documents. This task uses:

```js
.populate('memberId', 'name email')
.populate('trainerId', 'name specialization')
```

## 16. Why is `email` unique on Member?

It provides a unique identity for login and helps prevent two member documents from sharing the same email.

## 17. What does `enum` do in Mongoose?

It restricts a string field to a fixed set of values. Here membership types are `basic`, `premium`, `platinum`, and booking statuses are `booked`, `attended`, `cancelled`.

## 18. What happens when membershipType is `gold`?

Mongoose raises a `ValidationError`. The global error handler maps the individual Mongoose validation messages to a plain `errors` array and returns HTTP `400`.

## 19. Why not expose the raw Mongoose error?

Raw database errors can be verbose and leak implementation details. The API should return stable, client-friendly JSON.

## 20. What is the purpose of the global error handler?

It centralizes unexpected and known errors, keeps controller code cleaner, and ensures clients receive structured JSON rather than a stack trace.

## 21. Why must the error middleware be last?

Express executes middleware in registration order. The error handler should be registered after routes so errors passed to `next(err)` can flow into it.

## 22. Why call `next(err)` inside controllers?

It forwards the error to the centralized error-handling middleware instead of duplicating error-response logic in every controller.

## 23. Why validate booking fields before saving?

It gives the client a clear `400` response for missing required input and avoids unnecessary database work.

## 24. Can a member update another member's booking?

No. The status update query filters by both `_id` and `memberId`, so a booking must belong to the logged-in member.

## 25. What is the role of `.env`?

It stores environment-specific configuration such as `MONGO_URI`, `JWT_SECRET`, and the server port. Secrets should not be committed to source control.

## 26. Why is `.env.example` included?

It documents the required environment variables without exposing real secrets.

## 27. What would you add for Trainer and Admin roles?

I would add a role field/identity model, include the role in the access token, and create role-based middleware such as `requireRole('Trainer')` and `requireRole('Admin')`.

## 28. How does this prevent double-bookings?

The current assignment implements the required CRUD flow but does not yet enforce unique trainer/date/time constraints. For production, I would add a uniqueness strategy or an atomic transaction/conditional insert for the trainer, date and time slot.

## 29. How would you handle no-shows?

The `status` field supports `booked`, `attended`, and `cancelled`. A production system could add a `no_show` status or a scheduled job that marks missed sessions after the class end time.

## 30. How did you test the API?

Use Postman or Thunder Client in this order: health check, trainer listing, login, create booking, my bookings, status update, missing token test, and invalid input test.

## 31. What is the difference between authentication and authorization?

Authentication answers “Who are you?” Authorization answers “What are you allowed to do?” JWT verification handles authentication; role middleware would handle authorization.

## 32. Why use `JWT_SECRET`?

It is the signing secret used to create and verify JWTs. Only the server should know it.

## 33. What happens if the JWT is invalid or expired?

`jwt.verify()` throws an error, and `authGuard` returns `401 Unauthorized` with a structured JSON message.

## 34. What is the purpose of `next()`?

It tells Express to continue to the next middleware or route handler. `next(err)` switches execution to error-handling middleware.

## 35. Why separate routes, controllers, middleware and models?

This is separation of concerns. Routes define URLs, controllers contain business logic, middleware handles cross-cutting concerns, and models define database structure and validation.


**Q: Why use bcrypt instead of storing the password directly?**
A: Passwords should never be stored as plain text. bcrypt creates a one-way password hash and includes salting, so a database leak does not directly reveal member passwords.

**Q: Why is the passwordHash field marked `select: false`?**
A: It prevents the password hash from being returned by normal Mongoose queries. The login query explicitly uses `.select('+passwordHash')` only when verification is required.

**Q: Why does signup return 201 while login returns 200?**
A: Signup creates a new resource, so HTTP 201 Created is appropriate. Login authenticates an existing member and returns a token, so HTTP 200 OK is appropriate.
