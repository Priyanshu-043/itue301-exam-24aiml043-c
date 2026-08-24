# FitZone Gym & Class Booking System

A full-stack gym and class booking system built with **React, Express, Node.js, MongoDB, and Mongoose**.

FitZone replaces WhatsApp-based class booking with a centralized system where:

- Members can create accounts, sign in, view trainers, and book classes.
- Trainers can sign in and view their assigned class commitments.
- Admins can sign in and manage the trainer roster.
- JWT authentication protects role-specific APIs and pages.
- MongoDB stores members, trainers, and class bookings.

---

## 1. Technology Stack

### Frontend

- React
- Vite
- React Router
- React Context API
- Fetch API
- CSS

### Backend

- Node.js
- Express.js
- JWT (`jsonwebtoken`)
- bcryptjs
- Mongoose
- MongoDB
- dotenv

---

## 2. Project Structure

```text
fitzone-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── authGuard.js
│   │   ├── roleGuard.js
│   │   ├── requestLogger.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Member.js
│   │   ├── Trainer.js
│   │   └── ClassBooking.js
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── docs/
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── architecture.md
│   ├── api-test-requests.md
│   ├── postman-collection.json
│   └── viva.md
│
├── .env.example
├── package.json
└── README.md
```

---

## 3. System Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend   │
                    │     Vite + Router    │
                    └──────────┬──────────┘
                               │ HTTP / JSON
                               │ JWT Bearer Token
                               ▼
                    ┌─────────────────────┐
                    │   Express REST API  │
                    │                     │
                    │ Auth Middleware     │
                    │ Role Middleware     │
                    │ Request Logger      │
                    │ Error Handler       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Mongoose       │
                    │                     │
                    │ Member              │
                    │ Trainer             │
                    │ ClassBooking        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    └─────────────────────┘
```

---

## 4. User Roles

### Member

A member can:

- Sign up.
- Sign in.
- View trainers.
- Search trainers by specialization.
- Create class bookings.
- View their own bookings.
- Cancel bookings.

### Trainer

A trainer can:

- Sign in using trainer credentials created by Admin.
- View their own class commitments.
- See booking date, time, class name, member name, member email, and status.

### Admin

An admin can:

- Sign in.
- Access the Admin panel.
- Add trainers.
- Set trainer specialization.
- Set trainer availability.
- Create trainer login credentials.
- View the trainer roster.

---

## 5. Authentication

Authentication uses **JWT Bearer tokens**.

After successful login the server returns a token and role.

Example response:

```json
{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "role": "Member",
  "member": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "membershipType": "premium"
  }
}
```

Protected requests send:

```http
Authorization: Bearer <JWT_TOKEN>
```

The `authGuard` middleware validates the token and attaches the authenticated user to `req.member`.

Role-based endpoints additionally use `roleGuard`.

---

## 6. Authentication Flows

### Member Sign Up

```http
POST /api/v1/auth/signup
```

Example:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "secret123",
  "membershipType": "premium"
}
```

### Member / Trainer / Admin Sign In

```http
POST /api/v1/auth/login
```

Example:

```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

The same login endpoint identifies the account and returns the corresponding role.

---

## 7. Main API Endpoints

### Authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/signup` | Public | Create member account |
| POST | `/api/v1/auth/login` | Public | Authenticate user |

### Trainers

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/trainers` | Public | Get all trainers |
| POST | `/api/v1/trainers` | Admin | Add trainer |
| GET | `/api/v1/trainers/me/commitments` | Trainer | View trainer commitments |

### Bookings

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/v1/bookings` | Member | Create booking |
| GET | `/api/v1/bookings/my` | Member | Get logged-in member bookings |
| PATCH | `/api/v1/bookings/:id/status` | Protected | Update booking status |

---

## 8. MongoDB Data Model

### Member

```text
name             required
email            required, unique
phone            required
passwordHash     required
membershipType   basic | premium | platinum
role             Member
```

### Trainer

```text
name             required
email            required, unique
specialization   required
passwordHash     required
available        Boolean, default true
role             Trainer
```

### ClassBooking

```text
memberId         ref Member
trainerId        ref Trainer
className        required
date             required
timeSlot         required
status           booked | attended | cancelled
```

Mongoose references are used for:

```text
memberId → Member
trainerId → Trainer
```

---

## 9. Password Security

Passwords are never stored as plain text.

The backend uses `bcryptjs` to generate a password hash.

```text
Plain Password
      ↓
bcrypt hashing
      ↓
passwordHash stored in MongoDB
```

During login:

```text
Entered Password
      ↓
bcrypt.compare()
      ↓
Valid / Invalid
```

---

## 10. Admin and Trainer Account Creation

The Admin panel allows an administrator to create a trainer with:

- Name
- Email
- Password
- Specialization
- Availability

The backend creates the trainer record with a hashed password, allowing that trainer to sign in immediately through the normal login page.

Example:

```json
{
  "name": "John Smith",
  "email": "john@fitzone.com",
  "password": "trainer123",
  "specialization": "Strength Training",
  "available": true
}
```

The trainer then signs in using:

```text
Email: john@fitzone.com
Password: trainer123
```

---

## 11. Default Admin Account

The server can create an initial Admin account from environment variables.

Example `.env`:

```env
ADMIN_NAME=FitZone Admin
ADMIN_EMAIL=admin@fitzone.com
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=admin123456
```

On startup, the application checks whether the Admin account exists and creates it when required.

Use these credentials to sign in to the Admin UI.

> Change the default password before using the application outside a classroom/demo environment.

---

## 12. Frontend Pages

### Login Page

Supports sign-in for:

- Member
- Trainer
- Admin

The page uses the returned JWT and role to redirect the user to the appropriate dashboard.

### Classes Page

Members can:

- See trainers fetched from the backend.
- Search trainers by specialization.
- Select a trainer.
- Enter class name.
- Select date.
- Select time slot.
- Create a booking.

Trainer data is not hardcoded; it is loaded from:

```http
GET /api/v1/trainers
```

### My Bookings Page

Displays the logged-in member's bookings.

Booking data includes populated member and trainer details.

### Trainer Dashboard

Route:

```text
/trainer
```

Shows the trainer's commitments, including:

- Class name
- Date
- Time slot
- Member name
- Member email
- Booking status

### Admin Panel

Route:

```text
/admin
```

Provides the trainer management interface:

- Add trainer
- Set specialization
- Set availability
- Create trainer login credentials
- View existing trainers

---

## 13. React Component Architecture

Reusable components are separated from page components.

```text
components/
├── Layout.jsx
├── Navigation.jsx
├── ProtectedRoute.jsx
└── TrainerCard.jsx
```

`TrainerCard` receives trainer data through props:

```jsx
<TrainerCard
  name={trainer.name}
  specialization={trainer.specialization}
  available={trainer.available}
/>
```

Availability is displayed dynamically:

```text
true  → Available
false → Fully Booked
```

---

## 14. React State Management

`AuthContext` stores authentication state:

```text
member
 token
role
login()
logout()
```

Pages use `useState` for local state and `useEffect` for API requests.

For trainer searching, the full trainer array is fetched once and filtered on the client:

```js
trainers.filter(...)
```

Searching does not send another API request.

---

## 15. Middleware

### Request Logger

The custom logger is applied globally.

It uses `res.on('finish')` so the final status code is available.

Example output:

```text
[POST] [/api/v1/bookings] [201] [12.45 ms]
```

### Auth Guard

Validates:

```text
Authorization: Bearer <token>
```

Missing/invalid token returns:

```http
401 Unauthorized
```

### Role Guard

Restricts endpoints such as:

```text
Admin-only trainer creation
Trainer-only commitments
```

### Global Error Handler

Errors are returned as structured JSON rather than a raw Express stack trace.

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Trainer email is required"
  ]
}
```

---

## 16. Validation and HTTP Status Codes

The backend follows these main status codes:

| Status | Meaning |
|---|---|
| 200 | Successful GET/PATCH/login |
| 201 | Successful POST/create |
| 400 | Validation or malformed request |
| 401 | Missing/invalid authentication |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 409 | Duplicate resource such as unique email |
| 500 | Unhandled server error |

Mongoose validation errors are converted into meaningful application-level messages instead of exposing the raw Mongoose error object.

---

## 17. Environment Variables

Create `.env` in the backend root.

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/fitzone
JWT_SECRET=replace_with_a_strong_secret

ADMIN_NAME=FitZone Admin
ADMIN_EMAIL=admin@fitzone.com
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=admin123456
```

For the React frontend, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 18. Installation

### Backend

From the project root:

```bash
npm install
```

Then start the backend:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

## 19. MongoDB Setup

### Local MongoDB

Install and start MongoDB locally, then use:

```env
MONGO_URI=mongodb://localhost:27017/fitzone
```

### MongoDB Atlas

Create a cluster and place the connection string into `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Make sure the database user and network access rules are configured correctly.

---

## 20. Running the Complete Application

Run the backend first:

```bash
npm install
npm run dev
```

Then run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Recommended demo sequence:

```text
1. Sign in as Admin
2. Open Admin Panel
3. Add a Trainer with email + password
4. Sign out
5. Sign in as the Trainer
6. Verify the Trainer Dashboard
7. Sign out
8. Create a Member account
9. Sign in as Member
10. Open Classes
11. Select a trainer and book a class
12. Open My Bookings
13. Sign in again as Trainer
14. Verify the new commitment appears
```

---

## 21. Testing APIs

The project includes a Postman collection:

```text
docs/postman-collection.json
```

Import the collection into Postman and test:

1. Sign Up
2. Login
3. Get Trainers
4. Add Trainer as Admin
5. Create Booking
6. Get My Bookings
7. Update Booking Status
8. Get Trainer Commitments

For protected requests, provide the JWT as a Bearer token.

---

## 22. Important Booking Flow

```text
Member signs in
      ↓
GET /api/v1/trainers
      ↓
Select Trainer
      ↓
Enter Class + Date + Time Slot
      ↓
POST /api/v1/bookings
      ↓
Booking saved in MongoDB
      ↓
GET /api/v1/bookings/my
      ↓
Member sees booking
      ↓
Trainer opens /trainer
      ↓
GET /api/v1/trainers/me/commitments
      ↓
Trainer sees commitment
```

---

## 23. Role-Based UI Flow

```text
                    Login
                      │
            ┌─────────┼─────────┐
            │         │         │
          Member    Trainer    Admin
            │         │         │
            ▼         ▼         ▼
         /classes  /trainer   /admin
            │         │         │
       My Bookings   Commitments  Trainer Roster
```

---

## 24. Security Notes

This project is designed for a college/project demonstration and is intentionally simple.

For production use, additionally consider:

- HTTPS
- Strong random JWT secret
- JWT expiration and refresh tokens
- Password reset/OTP flow
- Rate limiting on authentication
- Helmet security headers
- Input sanitization
- CORS restrictions
- Audit logging
- Stronger authorization rules
- Database indexes for frequently queried fields
- Secret management instead of plain `.env` files

---

## 25. Key Learning Outcomes

This project demonstrates:

- REST API design
- Express middleware
- JWT authentication
- Role-based authorization
- React component architecture
- React Router
- Context API
- React state management
- `useEffect` API consumption
- Client-side search/filtering
- MongoDB schema design
- Mongoose references and population
- Validation and structured errors
- Full-stack integration

---

## 26. Viva Topics

The repository contains separate viva notes covering topics such as:

- Why React Router is used
- Why Context API is used
- JWT authentication
- `authGuard` vs `roleGuard`
- `res.on('finish')`
- Mongoose references
- `.populate()`
- Password hashing
- HTTP status codes
- Protected routes
- Trainer/member/admin responsibilities

See:

```text
docs/viva.md
frontend/docs/viva.md
```

---

## 27. Author / Project

**Project:** FitZone Gym & Class Booking System

**Purpose:** Full-stack academic/project implementation demonstrating React frontend development, Express REST APIs, middleware, authentication, authorization, MongoDB, Mongoose, and role-based UI.
