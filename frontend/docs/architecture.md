# FitZone Frontend Architecture

## Stack
- React 19
- React Router
- Vite
- Fetch API
- Context API

## Structure
```text
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navigation.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── TrainerCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AdminPanel.jsx
│   │   ├── ClassesPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── MyBookingsPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Routing
- `/` → LoginPage
- `/classes` → protected ClassesPage
- `/my-bookings` → protected MyBookingsPage
- `/admin` → protected lazy-loaded AdminPanel

Protected routes use `Outlet` and redirect to `/` when a token is absent.

## Authentication flow
1. LoginPage calls `POST /api/v1/auth/login`.
2. Signup uses `POST /api/v1/auth/signup`.
3. The API returns `token` and `member`.
4. AuthContext stores `{ member, token, role }` in React state and localStorage.
5. Protected booking calls send `Authorization: Bearer <token>`.
6. Logout clears state and localStorage.

## Trainer data flow
ClassesPage calls `GET /api/v1/trainers` inside `useEffect()` when mounted.
It stores `trainers`, `loading`, and `error` states.
The already-fetched array is filtered in memory using the search input and specialization.
TrainerCard receives `name`, `specialization`, and `available` through props.

## Booking state
ClassesPage uses `useState` for trainer, class name, date, and time slot. The selected trainer is derived from `form.trainerId` and displayed on the page.

## API dependency
The frontend reads `VITE_API_URL`. Example:
```env
VITE_API_URL=http://localhost:5000
```
